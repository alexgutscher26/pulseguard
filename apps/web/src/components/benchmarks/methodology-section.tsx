"use client";

import {
  BookOpen,
  Server,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Database,
  GitBranch,
} from "lucide-react";
import { BENCHMARK_ENDPOINTS } from "@/content/benchmarks-data";

export function MethodologySection() {
  return (
    <section className="py-16 md:py-24 bg-background border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <BookOpen className="size-3" />
            Scientific Rigor
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Experimental Methodology &amp; Setup
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-3 leading-relaxed">
            How we designed the 30-day benchmark fleet, calibrated ground truth
            measurement, and validated mathematical error bounds without bias.
          </p>
        </div>

        {/* 3 Steps / Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl border border-border bg-card/60">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Server className="size-5" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              1. The 10-Endpoint Target Fleet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We deployed 10 geographically isolated server endpoints across
              Cloudflare Workers, AWS us-east-1, Hetzner Frankfurt, Fly.io
              Singapore, and GCP. Endpoints were calibrated to exercise edge
              HTTP/2, TLS 1.3 session resumption, chunked streaming, and dynamic
              Geo-DNS resolution.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl border border-border bg-card/60">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Database className="size-5" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              2. Ingress Ground-Truth Audit
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every server endpoint streamed raw kernel and NGINX/Envoy ingress
              logs into an immutable ClickHouse cluster. An alert was classified
              as a <strong>Spurious Alert (False Positive)</strong> if and only
              if server ingress logs proved the endpoint was responding 200 OK
              to other traffic during that minute.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl border border-border bg-card/60">
            <div className="size-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <Cpu className="size-5" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              3. Controlled Fault Injection
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Over the 30-day run, we injected 4 real catastrophic server
              outages (5m, 12m, 2m, 45m) alongside realistic transient network
              noise: 12-second single-AS BGP route flaps, 200ms 503
              micro-bursts, and localized DNS TTL cache drops.
            </p>
          </div>
        </div>

        {/* Endpoints Roster Table */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm mb-12">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
            <h3 className="text-base font-bold text-foreground">
              Benchmark Endpoint Fleet Specification
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              The 10 production endpoints monitored simultaneously by
              SteadyStack, UptimeRobot, and Pingdom at 60-second intervals.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Endpoint ID</th>
                  <th className="py-3 px-4 font-semibold">Target Name</th>
                  <th className="py-3 px-4 font-semibold">Hosting Infra</th>
                  <th className="py-3 px-4 font-semibold">Protocol / Stack</th>
                  <th className="py-3 px-4 font-semibold">Testing Purpose</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Avg Latency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {BENCHMARK_ENDPOINTS.map((ep) => (
                  <tr
                    key={ep.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-primary">
                      {ep.id}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-foreground">
                      {ep.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {ep.provider}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {ep.protocol}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-muted-foreground/90 max-w-xs">
                      {ep.purpose}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                      {ep.baselineLatencyMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mathematical Definitions Box */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
          <h3 className="text-base font-bold text-foreground mb-4">
            Statistical Accuracy Formulations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 rounded-xl border border-border/70 bg-background/80">
              <span className="text-[11px] font-bold text-foreground block mb-1">
                Precision [P]
              </span>
              <div className="text-primary font-bold text-sm my-2">
                P = TP / (TP + FP)
              </div>
              <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                Percentage of alerts dispatched that corresponded to real,
                verified outages. SteadyStack scored 100%, UptimeRobot 12.5%,
                Pingdom 8.9%.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-background/80">
              <span className="text-[11px] font-bold text-foreground block mb-1">
                False Discovery Rate [FDR]
              </span>
              <div className="text-rose-400 font-bold text-sm my-2">
                FDR = FP / (TP + FP)
              </div>
              <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                Probability that an alert received by an on-call engineer is a
                false alarm. SteadyStack = 0.0%, Pingdom = 91.1%.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-background/80">
              <span className="text-[11px] font-bold text-foreground block mb-1">
                4-of-7 Quorum Bound
              </span>
              <div className="text-emerald-400 font-bold text-sm my-2">
                &sum; Votes &ge; 4 (n=7)
              </div>
              <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                Requires minimum 4 sovereign Cloudflare POPs (weur, enam, wnam,
                apac, eeur, apac-ne, apac-se) to record failure before incident
                dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
