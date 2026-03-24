"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="pricing">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Select your <span className="text-primary">plan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, transparent pricing for any infrastructure
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center gap-2 bg-[#0a0a0a] p-1.5 border border-white/5 rounded-full mt-8">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-6 py-2.5 text-sm font-semibold transition-all rounded-full",
                billing === "monthly"
                  ? "bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-6 py-2.5 text-sm font-semibold transition-all rounded-full flex items-center gap-2",
                billing === "yearly"
                  ? "bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: The Initiate */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col relative group hover:border-white/10 transition-colors">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-foreground font-semibold text-xl">The Initiate</h3>
              <p className="text-sm text-muted-foreground mt-2">
                "The Gateway Drug" for side projects.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
                <span className="text-muted-foreground text-sm font-medium">
                  /{billing === "yearly" ? "yr" : "mo"}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="text-sm space-y-4 text-muted-foreground font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">50 Active Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>3-Minute Heartbeat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>1 Public Status Page</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Email, Discord, Slack</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>3 Days Log Retention</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="mt-auto flex w-full items-center justify-center h-12 bg-transparent border border-white/10 hover:bg-white/5 text-foreground text-sm font-semibold rounded-full transition-colors"
              >
                Initialize
              </Link>
            </div>
          </div>

          {/* Tier 2: The Netrunner */}
          <div className="bg-[#0a0a0a] border border-primary/50 shadow-[0_0_40px_rgba(57,255,20,0.1)] rounded-2xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-black text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
              Most Popular
            </div>

            <div className="p-8 border-b border-primary/20 bg-primary/5 rounded-t-2xl">
              <h3 className="text-primary font-semibold text-xl">The Netrunner</h3>
              <p className="text-sm text-primary/70 mt-2">For the Indie Founders & Power Users.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  {billing === "yearly" ? "$140" : "$14"}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  /{billing === "yearly" ? "yr" : "mo"}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="text-sm space-y-4 text-muted-foreground font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground font-bold">200 Active Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground font-bold">30-Second Heartbeat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Multi-Region (3x) Verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Invisible AI Layer (Anomaly + Hints)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>SSL, TCP, Keyword Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>White-label Status Pages</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>30 Days Logs + PDF Reports</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=netrunner&billing=${billing}`}
                className="mt-auto flex w-full items-center justify-center h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full transition-colors"
              >
                Jack In
              </Link>
            </div>
          </div>

          {/* Tier 3: The Construct */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col relative group hover:border-white/10 transition-colors">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-foreground font-semibold text-xl">The Construct</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Enterprise reliability for Teams.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  {billing === "yearly" ? "$690" : "$69"}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  /{billing === "yearly" ? "yr" : "mo"}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="text-sm space-y-4 text-muted-foreground font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Unlimited Monitors (~1k Cap)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>10-Second HFT Heartbeat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Global Pulse (5 Regions)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>RBAC, SSO & Workspaces</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>PagerDuty / OpsGenie Sync</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Private Status Pages</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>1 Year Audit Retention</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=construct&billing=${billing}`}
                className="mt-auto flex w-full items-center justify-center h-12 bg-transparent border border-white/10 hover:bg-white/5 text-foreground text-sm font-semibold rounded-full transition-colors"
              >
                Initialize Core
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
