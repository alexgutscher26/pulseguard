"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  DollarSign,
  Clock,
  Users,
  Moon,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";
import Link from "next/link";

export function AlertFatigueCalculator() {
  const [endpointsCount, setEndpointsCount] = useState<number>(25);
  const [engineersCount, setEngineersCount] = useState<number>(6);
  const [hourlyRate, setHourlyRate] = useState<number>(95);
  const [interruptionMins, setInterruptionMins] = useState<number>(45);

  const calculations = useMemo(() => {
    // Benchmark study measured rate: ~1.37 false alerts / day / 10 endpoints on Pingdom = 0.137 false alerts / endpoint / day = ~50 false alerts / endpoint / year
    // Conservative industry rate based on UptimeRobot benchmark: ~0.93 / day / 10 endpoints = 33.9 false alerts / endpoint / year
    const falseAlertsPerEndpointYear = 28; // conservative midpoint
    const totalFalseAlertsPerYear = Math.round(
      endpointsCount * falseAlertsPerEndpointYear,
    );

    // Productivity loss in hours (context switch + investigation + sleep recovery)
    const hoursWastedPerYear = Math.round(
      totalFalseAlertsPerYear * (interruptionMins / 60),
    );
    const annualWastedCost = Math.round(hoursWastedPerYear * hourlyRate);

    // Hours wasted per engineer
    const hoursPerEngineer = (hoursWastedPerYear / engineersCount).toFixed(1);

    // Sleep interruption risk factor
    const nightAlertsPerYear = Math.round(totalFalseAlertsPerYear * 0.35); // 35% occur off-hours / night

    let burnoutRisk = "Moderate";
    let burnoutColor = "text-amber-400";
    if (totalFalseAlertsPerYear > 500) {
      burnoutRisk = "Severe (Critical Churn Risk)";
      burnoutColor = "text-rose-500";
    } else if (totalFalseAlertsPerYear > 200) {
      burnoutRisk = "High (Alert Fatigue)";
      burnoutColor = "text-rose-400";
    } else if (totalFalseAlertsPerYear < 80) {
      burnoutRisk = "Low";
      burnoutColor = "text-emerald-400";
    }

    return {
      totalFalseAlertsPerYear,
      hoursWastedPerYear,
      annualWastedCost,
      hoursPerEngineer,
      nightAlertsPerYear,
      burnoutRisk,
      burnoutColor,
    };
  }, [endpointsCount, engineersCount, hourlyRate, interruptionMins]);

  return (
    <section className="py-16 md:py-24 bg-background/50 border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Calculator className="size-3" />
            ROI &amp; Fatigue Modeling
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Calculate Your Team&apos;s False-Alert Cost
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-3 leading-relaxed">
            Every false alarm costs on-call engineer focus, disrupts sleep, and
            causes teams to mute paging channels. Model the real annual cost
            across your engineering organization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Form Panel */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-6">
            {/* Slider 1: Monitored Endpoints */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Monitored HTTP / API Endpoints:</span>
                </label>
                <span className="font-mono text-sm font-bold text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
                  {endpointsCount} endpoints
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={endpointsCount}
                onChange={(e) => setEndpointsCount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>5 (Startup)</span>
                <span>100 (Scale-up)</span>
                <span>250+ (Enterprise)</span>
              </div>
            </div>

            {/* Slider 2: On-Call Engineers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-muted-foreground" />
                  <span>On-Call Rotation Size:</span>
                </label>
                <span className="font-mono text-sm font-bold text-foreground px-2.5 py-0.5 rounded-lg bg-muted border border-border">
                  {engineersCount} engineers
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={engineersCount}
                onChange={(e) => setEngineersCount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>1 engineer</span>
                <span>15 engineers</span>
                <span>30 engineers</span>
              </div>
            </div>

            {/* Slider 3: Engineering Hourly Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                  <span>Blended Hourly Engineering Rate:</span>
                </label>
                <span className="font-mono text-sm font-bold text-foreground px-2.5 py-0.5 rounded-lg bg-muted border border-border">
                  ${hourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="250"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>$40/hr</span>
                <span>$95/hr (Avg Senior)</span>
                <span>$250/hr (Staff/Contract)</span>
              </div>
            </div>

            {/* Slider 4: Context Switch & Disruption Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>Time Lost per False Alarm (Context Switch):</span>
                </label>
                <span className="font-mono text-sm font-bold text-foreground px-2.5 py-0.5 rounded-lg bg-muted border border-border">
                  {interruptionMins} mins
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={interruptionMins}
                onChange={(e) => setInterruptionMins(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>15 mins (Quick blip)</span>
                <span>45 mins (Avg investigate + reset)</span>
                <span>90 mins (Night wake-up)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-8 backdrop-blur-sm shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Annual Impact Projection
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Based on 30D Study
                </span>
              </div>

              {/* Big Dollar Metric */}
              <div className="mb-6">
                <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider block mb-1">
                  Wasted Engineering Payroll / Year
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground">
                  ${calculations.annualWastedCost.toLocaleString()}
                </div>
                <span className="text-xs text-muted-foreground mt-1 block font-mono">
                  ({calculations.hoursWastedPerYear.toLocaleString()} lost
                  engineering hours)
                </span>
              </div>

              {/* Breakdown Stats */}
              <div className="space-y-3 font-mono text-xs mb-8">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Estimated False Alarms / Yr:
                  </span>
                  <span className="font-bold text-rose-400">
                    {calculations.totalFalseAlertsPerYear.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Moon className="size-3 text-muted-foreground" />3 AM
                    Nighttime Interruptions:
                  </span>
                  <span className="font-bold text-foreground">
                    {calculations.nightAlertsPerYear.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Lost Time / Engineer / Yr:
                  </span>
                  <span className="font-bold text-foreground">
                    {calculations.hoursPerEngineer} hrs
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Flame className="size-3 text-amber-400" />
                    On-Call Burnout Risk:
                  </span>
                  <span className={`font-bold ${calculations.burnoutColor}`}>
                    {calculations.burnoutRisk}
                  </span>
                </div>
              </div>
            </div>

            {/* SteadyStack Value Pitch */}
            <div className="p-4 rounded-xl bg-background/80 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <ShieldCheck className="size-4 shrink-0" />
                SteadyStack 4-of-7 Quorum Solution
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Mathematically eliminates false alarms across your{" "}
                {endpointsCount} endpoints, recovering $
                {calculations.annualWastedCost.toLocaleString()} in annual
                focus.
              </p>
              <Link
                href="/signup"
                className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
              >
                Eliminate False Alarms Today <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
