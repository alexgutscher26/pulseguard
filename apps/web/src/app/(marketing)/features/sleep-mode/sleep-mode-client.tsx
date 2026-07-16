"use client";

import { Moon, ArrowLeft, CheckCircle2, Shield, BellOff, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const verificationSteps = [
  {
    title: "Double-Check Protocol",
    description:
      "When a check fails, we wait 2 seconds and retry. Only if the second check also fails do we mark it DOWN. This eliminates transient network noise.",
    benefit: "Filters 1-2 second blips automatically.",
    icon: Activity,
  },
  {
    title: "Multi-Vector Verification",
    description:
      "A DOWN result from one region is not enough. We re-verify from a second global region before declaring an outage. If infrastructure fails, we treat it as UP.",
    benefit: "Prevents false alarms from regional network issues.",
    icon: Shield,
  },
  {
    title: "Flapping Detection",
    description:
      "If a monitor toggles UP/DOWN more than 3 times in 5 minutes, alerts are suppressed. Rapidly resolved incidents are re-opened rather than creating new ones.",
    benefit: "Stops alert storms from unstable services.",
    icon: BellOff,
  },
  {
    title: "Circuit Breaker",
    description:
      "Monitors DOWN for over an hour automatically reduce check frequency to 10-minute intervals. When they recover, normal cadence resumes.",
    benefit: "Saves resources during prolonged outages.",
    icon: Activity,
  },
];

const detectionComparisons = [
  {
    label: "2-second network blip",
    without: "❌ Wakes you up at 3 AM",
    with: "✓ Filtered — no alert sent",
  },
  {
    label: "Regional ISP outage",
    without: "❌ False positive — marks global DOWN",
    with: "✓ Cross-verified — no alert sent",
  },
  {
    label: "Deploy crash (real)",
    without: "✓ Detected after 5 minutes",
    with: "✓ Detected after 30 seconds (Netrunner)",
  },
  {
    label: "Flapping container",
    without: "❌ 20+ alerts in 10 minutes",
    with: "✓ 1 alert, then suppressed",
  },
];

export function SleepModeClient() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-20">
      {/* Navigation Breadcrumb */}
      <Link
        href="/#features"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium w-fit"
      >
        <ArrowLeft className="size-3.5" />
        Back to Overview
      </Link>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest w-fit">
            <Moon className="size-3" />
            Sleep Mode
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            If we call you at <span className="text-primary">3 AM</span>,
            <br />
            <span className="underline decoration-primary/30 decoration-2 underline-offset-4">
              it&apos;s real.
            </span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Solo devs hate waking up for false alarms. PulseGuard runs every check through a
            5-vector verification pipeline before alerting you. Two-second blips, regional ISP
            hiccups, and flapping containers get filtered. Real outages break through.
          </p>
          <div className="flex gap-4 pt-2">
            <Link
              href="/signup?plan=netrunner"
              className="inline-flex items-center gap-1.5 h-10 px-6 bg-primary text-primary-foreground font-bold text-xs rounded-lg border border-primary hover:bg-primary/90 transition-all"
            >
              Get The Sleep Plan — $14/mo
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center h-10 px-6 text-muted-foreground hover:text-foreground font-semibold text-xs rounded-lg border border-border hover:border-primary/30 transition-all"
            >
              Compare Plans
            </Link>
          </div>
        </div>

        {/* Visual: The Sleep Promise */}
        <div className="flex-1 w-full">
          <div className="border border-border bg-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.03] rounded-full blur-3xl" />
            <div className="flex flex-col gap-4 relative">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="size-4 text-primary" />
                <span className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">
                  The Sleep Promise
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {detectionComparisons.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-border/50 bg-black/20 p-3 flex items-center justify-between gap-4"
                  >
                    <span className="text-xs font-mono text-foreground min-w-[160px]">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-red-500/70 text-right">
                      {item.without}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold text-right">
                      {item.with}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border/30 pt-3 mt-1">
                <p className="text-[10px] text-muted-foreground font-mono leading-relaxed text-center">
                  PulseGuard&apos;s verification layer runs before any alert is sent. If your phone
                  buzzes, your users are already affected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Pipeline */}
      <div className="flex flex-col gap-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>The Verification Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            How PulseGuard filters noise
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Four layers of protection between a transient failure and your pager. Each layer is
            designed to eliminate a specific class of false positive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`border p-6 transition-all duration-300 ${
                  hoveredStep === idx
                    ? "border-primary/30 bg-primary/[0.03]"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2 border transition-colors ${
                      hoveredStep === idx
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-muted/30 border-border/60 text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Layer {idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-primary">{step.benefit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pricing Anchor */}
      <div className="border border-primary/20 bg-primary/[0.02] p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
            <Moon className="size-3" />
            The Sleep Plan
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            Upgrade to Netrunner — <span className="text-primary">$14/mo</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mb-6">
            The Sleep Plan isn&apos;t a gimmick — it&apos;s our Netrunner tier with 30-second
            checks, multi-region verification, anomaly detection, and flapping suppression. You get
            alerts that are accurate enough to trust with your sleep.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              "30-Second Checks",
              "Multi-Region Verify",
              "Anomaly Detection",
              "Flapping Suppression",
              "Circuit Breaker",
              "200 Monitors",
            ].map((feature) => (
              <span
                key={feature}
                className="text-[10px] font-mono text-muted-foreground border border-border/50 px-2.5 py-1"
              >
                {feature}
              </span>
            ))}
          </div>
          <Link
            href="/signup?plan=netrunner"
            className="inline-flex items-center gap-1.5 h-11 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-lg border border-primary hover:bg-primary/90 transition-all"
          >
            Get The Sleep Plan — $14/mo
          </Link>
        </div>
      </div>

      {/* Feature Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6 flex flex-col gap-3">
          <div className="p-2 bg-muted/30 border border-border/60 w-fit">
            <Moon className="size-5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Sleep Through the Night</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure quiet hours so only critical severity alerts break through. Non-urgent
            notifications queue for morning review.
          </p>
        </div>
        <div className="border border-border bg-card p-6 flex flex-col gap-3">
          <div className="p-2 bg-muted/30 border border-border/60 w-fit">
            <Activity className="size-5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">30-Second Probes</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            With the Sleep Plan, checks run every 30 seconds. If something breaks, we catch it fast
            and verify before notifying you.
          </p>
        </div>
        <div className="border border-border bg-card p-6 flex flex-col gap-3">
          <div className="p-2 bg-muted/30 border border-border/60 w-fit">
            <CheckCircle2 className="size-5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Real Alerts Only</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our multi-vector verification means every alert you receive has been confirmed by
            multiple global regions. False positives are our problem, not yours.
          </p>
        </div>
      </div>
    </div>
  );
}
