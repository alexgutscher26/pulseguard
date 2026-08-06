"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card/90 backdrop-blur-xl p-5 shadow-xl mb-8">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Interactive Live Demo Sandbox
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                PRE-SEEDED TELEMETRY
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Explore PulseGuard&apos;s real-time edge monitoring platform with zero setup or credit
              card required.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>1-Min Edge Checks</span>
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 px-5 text-xs font-mono font-bold bg-primary hover:opacity-90 text-primary-foreground uppercase tracking-wider shadow-md",
            )}
          >
            Create Free Account <ArrowRight className="size-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
