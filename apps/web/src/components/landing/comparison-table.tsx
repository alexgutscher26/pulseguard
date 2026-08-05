"use client";

import Link from "next/link";
import { Check, X, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { competitors, featureComparisons } from "./comparison-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ComparisonTable() {
  const pulseguard = competitors.find((c) => c.id === "pulseguard")!;
  const otherCompetitors = competitors.filter((c) => c.id !== "pulseguard");

  const renderValue = (val: string | boolean, isPulseguard = false) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Check className="size-3.5 stroke-[3]" />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center size-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600">
          <X className="size-3.5" />
        </div>
      );
    }

    return (
      <span
        className={`text-xs font-mono font-semibold ${
          isPulseguard
            ? "text-emerald-400 font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20"
            : "text-zinc-400"
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden border-b border-border">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="size-3.5" />
            Competitive Analysis
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Why Engineering Teams Choose <span className="text-emerald-400">PulseGuard</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
            Compare PulseGuard head-to-head against legacy uptime tools. Faster checks, broader
            global edge coverage, and native synthetic testing out of the box.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="border border-border/80 bg-zinc-950/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-border/80 bg-zinc-900/40">
                  <th className="p-5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground w-1/3">
                    Monitoring Capabilities
                  </th>

                  {/* PulseGuard Column Header */}
                  <th className="p-5 w-1/6 bg-emerald-950/30 border-x border-emerald-500/30 relative">
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {pulseguard.badge}
                      </span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        {pulseguard.name}
                      </span>
                      <Link
                        href="/signup"
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "h-7 px-3 text-[10px] font-mono font-bold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 uppercase tracking-wider mt-1 w-full",
                        )}
                      >
                        Try Free <ArrowRight className="size-3 ml-1" />
                      </Link>
                    </div>
                  </th>

                  {/* Competitor Columns Headers */}
                  {otherCompetitors.map((comp) => (
                    <th key={comp.id} className="p-5 w-1/6 text-center">
                      <div className="flex flex-col items-center text-center gap-1">
                        <span className="text-sm font-bold text-zinc-300 font-mono">
                          {comp.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-sans line-clamp-2 font-normal max-w-[140px]">
                          {comp.description}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/40 font-sans text-xs">
                {featureComparisons.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/30 transition-colors group">
                    {/* Feature Name & Description */}
                    <td className="p-4 sm:p-5">
                      <div className="font-semibold text-foreground text-sm font-sans flex items-center gap-2">
                        {feature.name}
                        {feature.name.includes("AI") && (
                          <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
                        )}
                      </div>
                      {feature.description && (
                        <div className="text-[11px] text-muted-foreground font-normal mt-0.5">
                          {feature.description}
                        </div>
                      )}
                    </td>

                    {/* PulseGuard Value Cell */}
                    <td className="p-4 sm:p-5 text-center bg-emerald-950/20 border-x border-emerald-500/20 group-hover:bg-emerald-950/30 transition-colors">
                      {renderValue(feature.pulseguard, true)}
                    </td>

                    {/* UptimeRobot Cell */}
                    <td className="p-4 sm:p-5 text-center">{renderValue(feature.uptimerobot)}</td>

                    {/* Checkly Cell */}
                    <td className="p-4 sm:p-5 text-center">{renderValue(feature.checkly)}</td>

                    {/* Better Uptime Cell */}
                    <td className="p-4 sm:p-5 text-center">{renderValue(feature.betteruptime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Banner */}
          <div className="p-4 sm:p-6 bg-zinc-900/60 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground font-mono">
              ⚡ Free 1-minute monitoring checks for up to 50 endpoints. No credit card required.
            </div>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-8 px-4 text-xs font-mono font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 uppercase tracking-wider",
              )}
            >
              Start Monitoring Now &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
