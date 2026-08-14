"use client";

import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Zap, Server, RefreshCw } from "lucide-react";
import { AVAILABLE_REGIONS } from "@pulseguard/shared";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [inputUrl, setInputUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("api.your-app.com/health");
  const [latencies, setLatencies] = useState({ us: 18, eu: 42, ap: 88, sa: 110 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [activeNodes, setActiveNodes] = useState<number[]>(Array.from({ length: 30 }, (_, i) => i));

  // Simulate continuous background telemetry fluctuations
  useEffect(() => {
    if (isScanning) return;

    const interval = setInterval(() => {
      setLatencies({
        us: Math.floor(Math.random() * 10) + 14,
        eu: Math.floor(Math.random() * 15) + 38,
        ap: Math.floor(Math.random() * 18) + 82,
        sa: Math.floor(Math.random() * 22) + 105,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || isScanning) return;

    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 90);

    setActiveNodes([]);

    setTimeout(() => {
      let cleanUrl = inputUrl.trim().replace(/^https?:\/\//i, "");
      if (cleanUrl.length > 35) cleanUrl = cleanUrl.substring(0, 32) + "...";
      setDisplayUrl(cleanUrl);

      let count = 0;
      const nodeInterval = setInterval(() => {
        setActiveNodes((prev) => [...prev, count]);
        count++;
        if (count >= 30) {
          clearInterval(nodeInterval);
        }
      }, 25);

      setLatencies({
        us: Math.floor(Math.random() * 8) + 12,
        eu: Math.floor(Math.random() * 12) + 34,
        ap: Math.floor(Math.random() * 15) + 76,
        sa: Math.floor(Math.random() * 18) + 98,
      });
      setIsScanning(false);
    }, 1800);
  };

  return (
    <section className="relative pt-36 pb-20 overflow-hidden min-h-screen flex flex-col justify-center bg-background border-b border-border">
      {/* Sleek, soft radial backdrop glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-20 w-full text-center flex flex-col items-center">
        {/* Animated Pill Badge */}
        <div className="animate-[heroBadge_0.5s_ease-out] inline-flex items-center gap-2 mb-8 text-[11px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 px-3.5 py-1.5 rounded-full uppercase shadow-[0_0_12px_rgba(16,185,129,0.05)] dark:shadow-[0_0_12px_rgba(52,211,153,0.15)]">
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500 dark:bg-emerald-400" />
          </span>
          <span>Mesh network monitoring deployed • 1-Min Checks</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-balance text-foreground max-w-4xl">
          Critical Uptime. <br className="hidden sm:inline" />
          <span className="text-muted-foreground">Zero False Positives.</span>
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-10 text-balance font-sans">
          PulseGuard monitors your API across {AVAILABLE_REGIONS.length} global edge regions with
          4-of-7 quorum consensus — eliminating false positives and alerting your team the moment
          real outages strike.
        </p>

        {/* Probe Input Form */}
        <form
          onSubmit={handleScan}
          className="relative w-full max-w-xl mb-14 bg-background/50 border border-border p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-xl flex items-center transition-all duration-300 hover:border-primary/30 focus-within:border-primary/40"
        >
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isScanning}
            placeholder="https://api.your-app.com/health"
            aria-label="Endpoint URL to check"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 border-none outline-none px-3.5 text-sm min-w-0 font-mono"
          />
          <button
            type="submit"
            disabled={isScanning || !inputUrl}
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-40 font-mono uppercase tracking-wider"
          >
            {isScanning ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Verify Uptime
                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </form>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signup"
            className="flex items-center justify-center h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-colors font-mono uppercase tracking-wider"
          >
            Start Free Trial <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center h-11 px-6 bg-transparent border border-border text-foreground hover:bg-accent text-xs font-semibold rounded-lg transition-colors font-mono uppercase tracking-wider"
          >
            Explore Features
          </Link>
        </div>

        {/* Interactive Animated Dashboard Visualization */}
        <div className="w-full max-w-4xl border border-border bg-card/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-left relative">
          {/* Scan overlay loader bar */}
          {isScanning && (
            <div
              className="absolute top-0 left-0 h-1 bg-emerald-400 transition-all duration-100 shadow-[0_0_12px_#10b981]"
              style={{ width: `${scanProgress}%` }}
            />
          )}

          {/* Window control header */}
          <div className="border-b border-border/80 px-4 py-3 flex items-center justify-between bg-muted/40 select-none">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-yellow-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest font-mono uppercase flex items-center gap-1.5">
              <Server className="size-3 text-emerald-400" />
              PULSEGUARD_EDGE_NODE_TELEMETRY
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              200 OK (100% SLA)
            </div>
          </div>

          {/* Content area */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Monitor Information Side */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                      Target Endpoint
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    GET / 200 OK
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-foreground truncate max-w-full">
                  {displayUrl}
                </div>
              </div>

              {/* Animated Latency Wave Chart (Borderless & Transparent Background) */}
              <div className="relative h-20 w-full overflow-hidden flex items-end">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 300 60"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,45 Q 30,20 60,40 T 120,25 T 180,45 T 240,15 T 300,35 L 300,60 L 0,60 Z"
                    fill="url(#waveGradient)"
                  />
                  <motion.path
                    d="M 0,45 Q 30,20 60,40 T 120,25 T 180,45 T 240,15 T 300,35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </svg>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Avg: {latencies.us}ms
                </div>
              </div>

              {/* 30-Day Operational Matrix */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono font-bold mb-2">
                  <span>30-DAY OPERATIONAL MATRIX</span>
                  <span className="text-emerald-400 font-bold">100.0% UPTIME</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 30 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-6 rounded-sm transition-all duration-300 ${
                        activeNodes.includes(idx)
                          ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                          : "bg-zinc-800/40"
                      }`}
                      style={{
                        opacity: activeNodes.includes(idx) ? 1 : 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Latencies Side */}
            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border/80 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between font-mono">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  <span>Global Edge Probes</span>
                  <Zap className="size-3.5 text-amber-400" />
                </div>

                <div className="flex flex-col gap-3">
                  {/* Region 1: US East */}
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-zinc-300 font-sans text-[11px]">
                        US-East (Virginia)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{latencies.us}ms</span>
                  </div>

                  {/* Region 2: EU Central */}
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-zinc-300 font-sans text-[11px]">
                        EU-Central (Frankfurt)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{latencies.eu}ms</span>
                  </div>

                  {/* Region 3: Asia Pacific */}
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-zinc-300 font-sans text-[11px]">AP-North (Tokyo)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{latencies.ap}ms</span>
                  </div>

                  {/* Region 4: South America */}
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-zinc-300 font-sans text-[11px]">
                        SA-East (São Paulo)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{latencies.sa}ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  Cloudflare Edge Workers
                </span>
                <span className="text-emerald-400/80">Continuous Validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
