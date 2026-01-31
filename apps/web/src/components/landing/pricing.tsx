"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-24 bg-background border-b border-border" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="border-l-2 border-primary pl-6">
            <h2 className="text-foreground text-4xl font-black tracking-tighter uppercase font-mono">
              Resource Allocation
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              // SELECT_TIER: INITIATE | NETRUNNER | CONSTRUCT
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-4 bg-muted/10 p-1 border border-border rounded-lg self-start md:self-auto">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-2 text-sm font-mono font-bold uppercase transition-all rounded-md",
                billing === "monthly"
                  ? "bg-primary text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-4 py-2 text-sm font-mono font-bold uppercase transition-all rounded-md flex items-center gap-2",
                billing === "yearly"
                  ? "bg-primary text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-current opacity-80">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Tier 1: The Initiate */}
          <div className="border border-border bg-background relative flex flex-col group hover:border-border/80 transition-colors">
            <div className="border-b border-border p-6 bg-muted/10">
              <h3 className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                [ THE INITIATE ]
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-foreground text-4xl font-black font-mono">$0</span>
                <span className="text-muted-foreground text-sm font-mono">
                  /{billing === "yearly" ? "YR" : "MO"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                "The Gateway Drug" for side projects.
              </p>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="font-mono text-xs space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span className="text-foreground">50 Active Monitors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>3-Minute Heartbeat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>1 Public Status Page</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>Email, Discord, Slack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>3 Days Log Retention</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="mt-auto flex w-full items-center justify-center h-12 border border-border hover:bg-muted text-foreground font-mono text-sm font-bold uppercase tracking-wider transition-all"
              >
                &gt; Initialize
              </Link>
            </div>
          </div>

          {/* Tier 2: The Netrunner */}
          <div className="border border-primary bg-background relative flex flex-col shadow-[0_0_30px_rgba(57,255,20,0.1)] transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-mono font-bold uppercase px-2 py-1">
              Best Value
            </div>
            <div className="border-b border-primary/30 p-6 bg-primary/5">
              <h3 className="text-primary font-mono text-sm uppercase tracking-widest">
                [ THE NETRUNNER ]
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-foreground text-4xl font-black font-mono">
                  {billing === "yearly" ? "$140" : "$14"}
                </span>
                <span className="text-muted-foreground text-sm font-mono">
                  /{billing === "yearly" ? "YR" : "MO"}
                </span>
              </div>
              <p className="text-xs text-primary/80 font-mono mt-2">
                For the Indie Founder & Power Users.
              </p>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="font-mono text-xs space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span className="text-foreground font-bold">200 Active Monitors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span className="text-foreground font-bold">30-Second Heartbeat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>Multi-Region (3x) Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>Invisible AI Layer (Anomaly + Hints)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>SSL, TCP, Keyword Monitors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>White-label Status Pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>30 Days Logs + PDF Reports</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=netrunner&billing=${billing}`}
                className="mt-auto flex w-full items-center justify-center h-12 bg-primary hover:bg-primary/90 text-black font-mono text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">&gt; Jack In</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Tier 3: The Construct */}
          <div className="border border-border bg-background relative flex flex-col group hover:border-primary/50 transition-colors">
            <div className="border-b border-border p-6 bg-muted/10">
              <h3 className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                [ THE CONSTRUCT ]
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-foreground text-4xl font-black font-mono">
                  {billing === "yearly" ? "$690" : "$69"}
                </span>
                <span className="text-muted-foreground text-sm font-mono">
                  /{billing === "yearly" ? "YR" : "MO"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                Enterprise reliability for Teams.
              </p>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-6">
              <ul className="font-mono text-xs space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span className="text-foreground">Unlimited Monitors (~1k Cap)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>10-Second HFT Heartbeat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>Global Pulse (5 Regions)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>RBAC, SSO & Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>PagerDuty / OpsGenie Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>Private Status Pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  <span>1 Year Audit Retention</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=construct&billing=${billing}`}
                className="mt-auto flex w-full items-center justify-center h-12 border border-border hover:bg-muted text-foreground font-mono text-sm font-bold uppercase tracking-wider transition-all"
              >
                &gt; Initialize Core
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
