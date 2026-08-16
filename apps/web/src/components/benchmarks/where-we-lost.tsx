"use client";

import {
  AlertTriangle,
  TrendingDown,
  Scale,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { WHERE_WE_LOST_ANALYSIS } from "@/content/benchmarks-data";

export function WhereWeLost() {
  return (
    <section className="py-16 md:py-24 bg-background border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Scale className="size-3" />
            Radical Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Where PulseGuard Lost
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-3 leading-relaxed">
            Engineers don&apos;t trust benchmark studies that claim 100% wins across every
            dimension. Every distributed systems architecture involves trade-offs. Here is exactly
            where our competitors outperformed us.
          </p>
        </div>

        {/* 3 Loss Analyses Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHERE_WE_LOST_ANALYSIS.map((loss, idx) => (
            <div
              key={loss.id}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
            >
              <div>
                {/* Header & Delta Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Trade-Off #{idx + 1}: {loss.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">{loss.delta}</span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                  {loss.title}
                </h3>

                {/* Scenario Description */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block mb-1">
                    Observed Scenario:
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{loss.scenario}</p>
                </div>

                {/* Why PulseGuard Lost */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-background/80 mb-4">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold tracking-wider block mb-1 flex items-center gap-1">
                    <TrendingDown className="size-3 text-rose-400" />
                    Why Competitor Won ({loss.competitorWinner}):
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {loss.whyPulseGuardLost}
                  </p>
                </div>

                {/* Architectural Rationale */}
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 mb-4">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-400" />
                    Why We Accept This Trade-Off:
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {loss.whyWeAcceptThisTradeoff}
                  </p>
                </div>
              </div>

              {/* Takeaway */}
              <div className="pt-4 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Core Principle: </span>
                {loss.engineeringTakeaway}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
