"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DemoBanner() {
  const router = useRouter();
  const [testUrl, setTestUrl] = useState("");

  const handleStartMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl.trim()) {
      router.push("/signup");
      return;
    }

    let formatted = testUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }

    try {
      let hostname = formatted.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const name = hostname.split("/")[0] + " Service";
      localStorage.setItem("steadystack_prefill_monitor", JSON.stringify({ url: formatted, name }));
    } catch {
      // ignore
    }

    router.push(`/signup?prefillUrl=${encodeURIComponent(formatted)}`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card/90 backdrop-blur-xl p-5 shadow-xl mb-8">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
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
                Explore SteadyStack&apos;s real-time edge monitoring platform with zero setup or
                credit card required.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
            <ShieldCheck className="size-4 text-primary" />
            <span>60s Edge Checks</span>
          </div>
        </div>

        {/* Interactive URL Pre-filler */}
        <form
          onSubmit={handleStartMonitoring}
          className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border/50"
        >
          <div className="relative w-full sm:flex-1">
            <Input
              type="text"
              placeholder="Enter your website or API URL to pre-fill 60s monitor (e.g. api.yourcompany.com)"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="bg-background/80 border-border/80 font-mono text-xs h-10 text-foreground placeholder:text-muted-foreground/60 pr-8"
            />
            <Zap className="size-3.5 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            type="submit"
            size="sm"
            className="w-full sm:w-auto h-10 px-5 text-xs font-mono font-bold bg-primary hover:opacity-90 text-primary-foreground uppercase tracking-wider shrink-0 shadow-md"
          >
            Start 60s Setup <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
