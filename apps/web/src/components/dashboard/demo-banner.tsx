"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-zinc-950 p-4 shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Sparkles className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                Interactive Demo Sandbox
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/20 text-amber-400 font-bold">
                PRE-SEEDED TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              You are exploring PulseGuard&apos;s live edge monitoring sandbox. No account or credit
              card required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            1-Min Check Interval
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 px-4 text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)]",
            )}
          >
            Create Free Account <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
