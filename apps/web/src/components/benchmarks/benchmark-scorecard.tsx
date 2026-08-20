"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Clock,
  DollarSign,
  Layers,
} from "lucide-react";
import { PROVIDER_SUMMARIES } from "@/content/benchmarks-data";

export function BenchmarkScorecard() {
  return (
    <section className="py-16 md:py-20 bg-background/50 border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Layers className="size-3" />
            Empirical Results Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Side-by-Side Performance Comparison
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-3 leading-relaxed">
            Every metric below is calculated across 432,000 synthetic checks per
            provider over the exact same 30-day window against identical server
            infrastructure.
          </p>
        </div>

        {/* 3 Contenders Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PROVIDER_SUMMARIES.map((p) => {
            const isPG = p.providerName === "SteadyStack";
            const isUR = p.providerName === "UptimeRobot";

            return (
              <div
                key={p.providerName}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                  isPG
                    ? "border-emerald-500/40 bg-emerald-950/10 shadow-[0_0_30px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/20"
                    : "border-border/70 bg-card/50"
                }`}
              >
                {isPG && (
                  <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold uppercase tracking-wide">
                    Benchmark Winner (0 False Alarms)
                  </div>
                )}

                <div>
                  {/* Provider Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {p.providerName}
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        {p.logoBadge}
                      </span>
                    </div>
                    {isPG ? (
                      <span className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                        PG
                      </span>
                    ) : isUR ? (
                      <span className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs font-mono">
                        UR
                      </span>
                    ) : (
                      <span className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs font-mono">
                        PD
                      </span>
                    )}
                  </div>

                  {/* Primary Metric: Spurious Alerts */}
                  <div className="p-4 rounded-xl bg-background/80 border border-border/60 mb-6">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                      Spurious Alerts (False Alarms)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-extrabold ${
                          isPG ? "text-emerald-400" : "text-rose-500"
                        }`}
                      >
                        {p.spuriousAlerts}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        (
                        {p.spuriousAlerts === 0
                          ? "0.00%"
                          : `${(p.spuriousAlertRatePercent * 100).toFixed(3)}%`}{" "}
                        check error rate)
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-1.5 leading-snug">
                      {isPG
                        ? "4-of-7 Quorum required. All transient network blips rejected."
                        : `${p.spuriousAlerts} phantom pages dispatched to on-call engineers.`}
                    </span>
                  </div>

                  {/* Metric List */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">
                        Precision (TP / (TP+FP)):
                      </span>
                      <span
                        className={`font-bold ${isPG ? "text-emerald-400" : "text-foreground"}`}
                      >
                        {p.precisionPercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">
                        Recall (True Outages):
                      </span>
                      <span className="font-bold text-emerald-400">
                        {p.recallPercent.toFixed(0)}% (4/4)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">F₁ Score:</span>
                      <span
                        className={`font-bold ${isPG ? "text-emerald-400" : "text-foreground"}`}
                      >
                        {p.f1Score.toFixed(3)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">
                        Mean Time to Verdict:
                      </span>
                      <span className="font-bold text-foreground">
                        {p.meanTimeToVerdictMs < 1000
                          ? `${p.meanTimeToVerdictMs}ms`
                          : `${(p.meanTimeToVerdictMs / 1000).toFixed(1)}s`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">
                        First-Webhook Dispatch:
                      </span>
                      <span className="font-bold text-foreground">
                        {(p.firstWebhookLatencyMs / 1000).toFixed(2)}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-muted-foreground">
                        Cost / Synthetic Check:
                      </span>
                      <span className="font-bold text-foreground">
                        {p.monthlyCostPerCheck}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Architecture Note */}
                <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Mechanism:{" "}
                  </span>
                  {p.architectureSummary}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Comprehensive Comparison Table */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
            <h3 className="text-lg font-bold text-foreground">
              Detailed Metric Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Comparing statistical accuracy, false discovery rates,
              verification latencies, and operational overhead.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">
                    Evaluation Dimension
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-emerald-400">
                    SteadyStack (Edge Quorum)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">
                    UptimeRobot (Pro)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">
                    Pingdom (Advanced)
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Advantage / Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    Total Synthetic Probes
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    432,000
                  </td>
                  <td className="py-3.5 px-4">432,000</td>
                  <td className="py-3.5 px-4">432,000</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">
                    Identical 60s test interval
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors bg-emerald-500/[0.02]">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    Spurious Alerts (False Positives)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold text-sm">
                    0 (0.00%)
                  </td>
                  <td className="py-3.5 px-4 text-rose-400 font-bold">
                    28 false alarms
                  </td>
                  <td className="py-3.5 px-4 text-rose-400 font-bold">
                    41 false alarms
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                    SteadyStack (100% clean)
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    Precision Rate [TP / (TP + FP)]
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    100.0%
                  </td>
                  <td className="py-3.5 px-4 text-amber-400">12.5%</td>
                  <td className="py-3.5 px-4 text-amber-400">8.9%</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                    SteadyStack +87.5%
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    Recall Rate (True Outages Caught)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    100.0% (4/4)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    100.0% (4/4)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    100.0% (4/4)
                  </td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">
                    All 3 platforms tied (100%)
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    False Discovery Rate (FDR)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    0.0%
                  </td>
                  <td className="py-3.5 px-4 text-rose-400">87.5%</td>
                  <td className="py-3.5 px-4 text-rose-400">91.1%</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                    SteadyStack (Zero fatigue)
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    Consensus Verdict Latency
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    840ms (Parallel Quorum)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    31,400ms (+30s retry)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    28,200ms (+25s probe 2)
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                    SteadyStack (33x faster)
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors bg-amber-500/[0.03]">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground flex items-center gap-1.5">
                    <Zap className="size-3.5 text-amber-400 shrink-0" />
                    First-Webhook Alert Latency (Hard Crash)
                  </td>
                  <td className="py-3.5 px-4 text-foreground font-bold">
                    4.12s (Parallel wait)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">34.80s</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">
                    3.21s (Single probe)
                  </td>
                  <td className="py-3.5 px-4 text-right text-amber-400 font-bold">
                    Pingdom won by 910ms*
                  </td>
                </tr>

                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    Monthly Infrastructure Cost / Check
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    $0.000012 (Edge DO)
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    $0.000080
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    $0.000195
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                    SteadyStack (6.6x - 16x cheaper)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-muted/10 border-t border-border text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="font-bold text-amber-400">* Note:</span>
            <span>
              On total catastrophic server crashes, Pingdom fired its initial
              webhook 910ms faster because it relied on a single failing probe
              without waiting for global quorum. See the &ldquo;Where We
              Lost&rdquo; section for a complete engineering breakdown.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
