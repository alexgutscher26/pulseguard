"use client";

import { useState } from "react";
import { Trophy, Medal, Crown, ExternalLink, Shield, Activity, Users, Zap } from "lucide-react";
import Link from "next/link";
import type { LeaderboardEntry } from "@/actions/leaderboard";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="size-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="size-5 text-gray-400" />;
  if (rank === 3) return <Medal className="size-5 text-amber-700" />;
  return <span className="text-xs font-mono text-muted-foreground w-5 text-center">{rank}</span>;
}

function UptimeBadge({ pct }: { pct: number }) {
  const color =
    pct >= 99.99
      ? "text-green-500 bg-green-500/10 border-green-500/20"
      : pct >= 99.9
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        : pct >= 99.0
          ? "text-lime-500 bg-lime-500/10 border-lime-500/20"
          : pct >= 95.0
            ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
            : "text-orange-500 bg-orange-500/10 border-orange-500/20";

  return (
    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${color}`}>
      {pct.toFixed(2)}%
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    CONSTRUCT: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    NETRUNNER: "text-primary bg-primary/10 border-primary/20",
    INITIATE: "text-muted-foreground bg-muted/20 border-muted/30",
  };

  return (
    <span
      className={`text-[9px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 border ${colors[tier] || colors.INITIATE}`}
    >
      {tier}
    </span>
  );
}

export function HallOfFameClient({ initialEntries }: { initialEntries: LeaderboardEntry[] }) {
  const [entries] = useState(initialEntries);
  const [rankBy, setRankBy] = useState<"uptime" | "monitors">("uptime");

  const sorted = [...entries].sort((a, b) => {
    if (rankBy === "monitors") return b.monitorCount - a.monitorCount;
    return b.uptimePct - a.uptimePct;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] font-bold font-mono uppercase tracking-widest w-fit">
          <Trophy className="size-3" />
          Community Hall of Fame
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          <span className="text-yellow-500 underline decoration-yellow-500/30 decoration-2 underline-offset-4">
            Top-Tier
          </span>{" "}
          Uptime Performers
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          The indie hackers and teams running the most reliable infrastructure on PulseGuard. Ranked
          by weighted SLA across all monitors. Opt in from your settings to claim your spot.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border bg-card/50 p-3 text-center">
          <Activity className="size-4 mx-auto mb-1 text-primary" />
          <span className="block text-lg font-bold font-mono text-foreground">
            {entries.length > 0 ? `${entries[0].uptimePct.toFixed(2)}%` : "—"}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            Top Uptime
          </span>
        </div>
        <div className="border border-border bg-card/50 p-3 text-center">
          <Users className="size-4 mx-auto mb-1 text-primary" />
          <span className="block text-lg font-bold font-mono text-foreground">
            {entries.length}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            Participants
          </span>
        </div>
        <div className="border border-border bg-card/50 p-3 text-center">
          <Zap className="size-4 mx-auto mb-1 text-primary" />
          <span className="block text-lg font-bold font-mono text-foreground">
            {entries.reduce((s, e) => s + e.totalChecks, 0).toLocaleString()}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            Total Checks
          </span>
        </div>
      </div>

      {/* Sort Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setRankBy("uptime")}
          className={`text-[10px] font-bold font-mono uppercase tracking-wider px-3 py-1.5 border transition-all ${
            rankBy === "uptime"
              ? "bg-primary text-black border-primary"
              : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
          }`}
        >
          By Uptime
        </button>
        <button
          onClick={() => setRankBy("monitors")}
          className={`text-[10px] font-bold font-mono uppercase tracking-wider px-3 py-1.5 border transition-all ${
            rankBy === "monitors"
              ? "bg-primary text-black border-primary"
              : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
          }`}
        >
          By Monitors
        </button>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center">
          <Trophy className="size-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-mono">
            No participants yet. Be the first — enable "Show on Leaderboard" in your settings.
          </p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border/50">
          {sorted.map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center gap-4 px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="w-8 flex justify-center shrink-0">
                <RankIcon rank={entry.rank} />
              </div>

              <div className="size-9 rounded-full border border-border bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                {entry.image ? (
                  <img src={entry.image} alt={entry.name} className="size-full object-cover" />
                ) : (
                  <span className="text-xs font-bold font-mono text-muted-foreground">
                    {entry.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {entry.name}
                  </span>
                  <TierBadge tier={entry.tier} />
                  {entry.statusPageSlug && (
                    <a
                      href={`/status-page/${entry.statusPageSlug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                {entry.bio && (
                  <p className="text-[10px] text-muted-foreground/70 font-mono truncate max-w-md">
                    {entry.bio}
                  </p>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-3 text-right shrink-0">
                <div>
                  <UptimeBadge pct={entry.uptimePct} />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  <span className="text-foreground font-semibold">{entry.monitorCount}</span>{" "}
                  monitors
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {entry.totalChecks.toLocaleString()}
                  </span>{" "}
                  checks
                </div>
              </div>

              <div className="sm:hidden flex items-center gap-2 shrink-0">
                <UptimeBadge pct={entry.uptimePct} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {entry.monitorCount}m
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA — Opt In */}
      <div className="border border-dashed border-primary/20 bg-primary/[0.02] p-6 text-center">
        <Shield className="size-5 mx-auto mb-2 text-primary" />
        <p className="text-sm font-semibold text-foreground mb-1">
          Want your spot on the leaderboard?
        </p>
        <p className="text-[11px] text-muted-foreground font-mono max-w-md mx-auto mb-4">
          Enable "Show on Leaderboard" in your privacy settings. Your monitors' uptime will be
          aggregated and ranked against the community. Only users with 100+ checks qualify.
        </p>
        <Link
          href="/dashboard/settings?tab=privacy"
          className="inline-flex items-center gap-1.5 h-9 px-5 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider rounded-sm border border-primary hover:bg-primary/90 transition-all font-mono"
        >
          Opt In Now
        </Link>
      </div>
    </div>
  );
}
