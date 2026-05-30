"use client";

import Link from "next/link";
import { ArrowRight, Globe, Shield, Activity, Clock, CheckCircle } from "lucide-react";
import { AVAILABLE_REGIONS, PRODUCT_CONFIG } from "@pulseguard/shared";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [inputUrl, setInputUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("api.your-app.com");
  const [latencies, setLatencies] = useState({ us: 18, eu: 42, ap: 88 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [activeNodes, setActiveNodes] = useState<number[]>(Array.from({ length: 30 }, (_, i) => i));

  // Simulate background latency shifts
  useEffect(() => {
    if (isScanning) return;

    const interval = setInterval(() => {
      setLatencies({
        us: Math.floor(Math.random() * 12) + 12,
        eu: Math.floor(Math.random() * 15) + 35,
        ap: Math.floor(Math.random() * 20) + 80,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || isScanning) return;

    setIsScanning(true);
    setScanProgress(0);

    // Animate scan progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    // Randomize nodes during scan
    setActiveNodes([]);

    setTimeout(() => {
      // Set the display url
      let cleanUrl = inputUrl.trim().replace(/^https?:\/\//i, "");
      if (cleanUrl.length > 32) cleanUrl = cleanUrl.substring(0, 30) + "...";
      setDisplayUrl(cleanUrl);

      // Add nodes one by one
      let count = 0;
      const nodeInterval = setInterval(() => {
        setActiveNodes((prev) => [...prev, count]);
        count++;
        if (count >= 30) {
          clearInterval(nodeInterval);
        }
      }, 30);

      setLatencies({
        us: Math.floor(Math.random() * 10) + 10,
        eu: Math.floor(Math.random() * 15) + 32,
        ap: Math.floor(Math.random() * 20) + 75,
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <section className="relative pt-36 pb-20 overflow-hidden min-h-screen flex flex-col justify-center bg-background border-b border-border">
      {/* Sleek, soft radial backdrop glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-20 w-full text-center flex flex-col items-center">
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 text-[11px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 px-3.5 py-1.5 rounded-full uppercase shadow-[0_0_12px_rgba(16,185,129,0.05)] dark:shadow-[0_0_12px_rgba(52,211,153,0.15)]"
        >
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500 dark:bg-emerald-400"></span>
          </span>
          <span>Mesh network monitoring deployed</span>
        </motion.div>

        {/* Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-balance text-foreground max-w-4xl">
          Critical Uptime. <br className="hidden sm:inline" />
          <span className="text-muted-foreground">Zero False Positives.</span>
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-10 text-balance">
          PulseGuard tracks latency goals and validates connections using a global array of{" "}
          {AVAILABLE_REGIONS.length}+ regional nodes. Monitor continuously, assure API responses,
          and alert instantly.
        </p>

        {/* Probe Input Form */}
        <form
          onSubmit={handleScan}
          className="relative w-full max-w-xl mb-14 bg-background/50 border border-border p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-xl flex items-center transition-all duration-300 hover:border-primary/30"
        >
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isScanning}
            placeholder="https://api.your-app.com/health"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 border-none outline-none px-3.5 text-sm min-w-0"
          />
          <button
            type="submit"
            disabled={isScanning || !inputUrl}
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-40"
          >
            {isScanning ? "Scanning..." : "Verify Uptime"}
            <ArrowRight className="size-3.5" />
          </button>
        </form>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signup"
            className="flex items-center justify-center h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-colors"
          >
            Start Free Trial <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center h-11 px-6 bg-transparent border border-border text-foreground hover:bg-accent text-xs font-semibold rounded-lg transition-colors"
          >
            Explore Features
          </Link>
        </div>

        {/* Interactive Dashboard Mockup Container */}
        <div className="w-full max-w-3xl border border-border bg-card rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden text-left relative">
          {/* Scan overlay loader bar */}
          {isScanning && (
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-100"
              style={{ width: `${scanProgress}%` }}
            ></div>
          )}

          {/* Window control header */}
          <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-muted/30 select-none">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-border"></span>
              <span className="size-2.5 rounded-full bg-border"></span>
              <span className="size-2.5 rounded-full bg-border"></span>
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground tracking-wide font-mono">
              PULSEGUARD_SATELLITE_DEMO
            </div>
            <div className="w-10"></div>
          </div>

          {/* Content area */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Monitor Information Side */}
            <div className="md:col-span-7 flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="size-4.5 text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Active Monitor
                  </span>
                </div>
                <div className="text-xl font-bold text-foreground truncate max-w-full">
                  {displayUrl}
                </div>
              </div>

              {/* Uptime nodes list */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold mb-2">
                  <span>30-DAY OPERATIONAL MATRIX</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                    100.0% UPTIME
                  </span>
                </div>
                {/* 30 green blocks */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 30 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-6 transition-all duration-300 ${
                        activeNodes.includes(idx)
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : "bg-muted/30 dark:bg-white/5"
                      }`}
                      style={{
                        opacity: activeNodes.includes(idx) ? 1 : 0.2,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Latency Side */}
            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6 flex flex-col gap-4 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Regional Latencies
              </div>

              {/* Region 1: US East */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="size-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></span>
                  <span className="text-muted-foreground">US East (Virginia)</span>
                </div>
                <span className="text-xs font-bold text-foreground">{latencies.us}ms</span>
              </div>

              {/* Region 2: EU Central */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="size-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></span>
                  <span className="text-muted-foreground">EU Central (Frankfurt)</span>
                </div>
                <span className="text-xs font-bold text-foreground">{latencies.eu}ms</span>
              </div>

              {/* Region 3: Asia Pacific */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="size-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></span>
                  <span className="text-muted-foreground">Asia North (Tokyo)</span>
                </div>
                <span className="text-xs font-bold text-foreground">{latencies.ap}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
