"use client";

import { useState } from "react";
import {
  Terminal,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Database,
  FileCode,
} from "lucide-react";
import Link from "next/link";
import { BENCHMARK_METADATA } from "@/content/benchmarks-data";

export function ReproduceHarness() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const reproduceCommand = `# 1. Clone repository & install dependencies
git clone https://github.com/getsteadystack/SteadyStack.git
cd steadystack && bun install

# 2. Run standalone benchmark verification script against raw dataset
bun scripts/verify-benchmark.js

# 3. Query the public API directly
curl -s https://steadystack.dev/api/benchmarks/false-positives | jq .summary`;

  return (
    <section className="py-16 md:py-24 bg-background/50 border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Terminal className="size-3" />
            Zero Black Boxes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Reproduce the Results Locally
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-3 leading-relaxed">
            Engineers don&apos;t believe marketing claims — they verify math.
            Clone the repository, inspect the raw ClickHouse ingress logs, and
            run the calculation script on your own machine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Terminal Block (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-zinc-950 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-zinc-400 ml-2">
                  bash - verification-harness
                </span>
              </div>
              <button
                onClick={() => copyText("cli", reproduceCommand)}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 transition-colors"
              >
                {copiedCmd === "cli" ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <pre className="font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed whitespace-pre">
              {reproduceCommand}
            </pre>
          </div>

          {/* Dataset Downloads & SHA-256 (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* SHA-256 Box */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                Immutable Dataset Hash (SHA-256)
              </div>
              <div className="p-3 rounded-xl bg-background border border-border/80 font-mono text-[11px] text-muted-foreground break-all mb-3 flex items-center justify-between gap-2">
                <span>{BENCHMARK_METADATA.groundTruthAuditHashSha256}</span>
                <button
                  onClick={() =>
                    copyText(
                      "sha",
                      BENCHMARK_METADATA.groundTruthAuditHashSha256,
                    )
                  }
                  className="p-1 text-muted-foreground hover:text-foreground shrink-0"
                  title="Copy SHA-256 hash"
                >
                  {copiedCmd === "sha" ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Cryptographic checksum of the raw JSON test ledger. Run{" "}
                <code className="text-primary font-mono">
                  sha256sum false-positive-benchmark-30d.json
                </code>{" "}
                to confirm zero post-hoc modifications.
              </p>
            </div>

            {/* Download Links */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm shadow-sm space-y-3">
              <span className="text-xs font-mono font-bold text-foreground block">
                Direct Raw Dataset Downloads:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/data/false-positive-benchmark-30d.json"
                  download="false-positive-benchmark-30d.json"
                  className="p-3 rounded-xl border border-border bg-background hover:bg-accent flex flex-col items-center justify-center text-center gap-1.5 transition-colors group"
                >
                  <FileCode className="size-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    dataset.json
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Full JSON (69 Incidents)
                  </span>
                </a>

                <a
                  href="/data/false-positive-benchmark-30d.csv"
                  download="false-positive-benchmark-30d.csv"
                  className="p-3 rounded-xl border border-border bg-background hover:bg-accent flex flex-col items-center justify-center text-center gap-1.5 transition-colors group"
                >
                  <Database className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    dataset.csv
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Spreadsheet Export
                  </span>
                </a>
              </div>

              <Link
                href="https://github.com/getsteadystack/SteadyStack/blob/master/scripts/verify-benchmark.js"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center gap-1.5 text-xs font-mono font-medium transition-colors"
              >
                <span>View Verification Script on GitHub</span>
                <ExternalLink className="size-3 opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
