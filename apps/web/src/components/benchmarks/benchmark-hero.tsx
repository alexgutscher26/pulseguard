"use client";

import {
  Activity,
  ShieldCheck,
  Download,
  Share2,
  Check,
  ExternalLink,
  Terminal,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { BENCHMARK_METADATA } from "@/content/benchmarks-data";

export function BenchmarkHero() {
  const [copiedCitation, setCopiedCitation] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(BENCHMARK_METADATA.citationMarkdown);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-border/80 bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-emerald-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        {/* Badges / Header Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[11px] font-mono font-semibold tracking-wide uppercase">
            <Activity className="size-3.5" />
            30-Day Empirical Study
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[11px] font-mono font-semibold">
            <ShieldCheck className="size-3.5" />
            1,296,000 Verified Probes
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground text-[11px] font-mono">
            <Sparkles className="size-3 text-amber-400" />
            Show HN & Newsletter Edition
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6">
          The False-Positive <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Benchmark Study
          </span>
        </h1>

        {/* Subtitle / Positioning */}
        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
          We ran <span className="text-foreground font-semibold">PulseGuard</span>,{" "}
          <span className="text-foreground font-semibold">UptimeRobot</span>, and{" "}
          <span className="text-foreground font-semibold">Pingdom</span> against 10 identical
          endpoints for 30 days. We counted every single spurious alert, measured detection latency,
          published the methodology, and released the complete dataset —{" "}
          <span className="text-primary font-bold">including the 3 scenarios where we lost.</span>
        </p>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mb-10 text-left">
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              Spurious Alerts (PG)
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-500">0</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                0.00% error
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">vs 28 (UR) & 41 (PD)</span>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              Consensus Speed
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-foreground">840</span>
              <span className="text-xs font-medium text-muted-foreground font-mono">ms</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">
              Parallel 4-of-7 Quorum
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              True Recall Rate
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-400">100%</span>
              <span className="text-xs font-medium text-muted-foreground font-mono">4 / 4</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">All outages caught</span>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              Raw Probes Analyzed
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-foreground">1.29M</span>
              <span className="text-xs font-medium text-muted-foreground font-mono">checks</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">30 days @ 60s cadence</span>
          </div>
        </div>

        {/* CTA Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="#incident-explorer"
            className="h-10 px-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs tracking-wide shadow-sm hover:bg-primary/90 transition-all duration-200"
          >
            Explore Raw Incident Log
          </a>

          <a
            href="/data/false-positive-benchmark-30d.json"
            download="false-positive-benchmark-30d.json"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 hover:bg-accent text-foreground font-medium text-xs shadow-sm transition-all duration-200"
          >
            <Download className="size-3.5 text-primary" />
            Download Dataset (JSON)
          </a>

          <a
            href="/data/false-positive-benchmark-30d.csv"
            download="false-positive-benchmark-30d.csv"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 hover:bg-accent text-foreground font-medium text-xs shadow-sm transition-all duration-200"
          >
            <Download className="size-3.5 text-emerald-500" />
            Download CSV
          </a>

          <button
            onClick={handleCopyCitation}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground font-mono text-xs transition-all duration-200"
            title="Copy academic / markdown citation"
          >
            {copiedCitation ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-sans font-medium">Citation Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                <span>Cite Study</span>
              </>
            )}
          </button>
        </div>

        {/* Trust & Open Source Note */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            SHA-256 Verified
          </span>
          <span className="text-border">•</span>
          <Link
            href="https://github.com/alexgutscher26/pulseguard"
            target="_blank"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Terminal className="size-3 text-primary" />
            github.com/alexgutscher26/pulseguard
            <ExternalLink className="size-2.5 opacity-60" />
          </Link>
        </div>
      </div>
    </section>
  );
}
