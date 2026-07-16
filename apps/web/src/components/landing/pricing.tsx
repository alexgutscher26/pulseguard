"use client";

import Link from "next/link";
import { Check, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRODUCT_CONFIG } from "@pulseguard/shared";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      className="py-28 bg-background relative overflow-hidden border-b border-border"
      id="pricing"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-20">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Flexible Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Select your plan
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Simple, developer-friendly options designed to scale with your backend infrastructure.
          </p>

          {/* Minimalist Billing Toggle */}
          <div className="flex items-center gap-1 bg-muted p-1 border border-border rounded-full mt-8">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-5 py-2 text-xs font-semibold transition-all rounded-full cursor-pointer",
                billing === "monthly"
                  ? "bg-card text-foreground shadow-sm border border-border/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-5 py-2 text-xs font-semibold transition-all rounded-full flex items-center gap-1.5 cursor-pointer",
                billing === "yearly"
                  ? "bg-card text-foreground shadow-sm border border-border/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: The Initiate */}
          <div className="bg-card border border-border rounded-2xl flex flex-col relative hover:border-primary/20 transition-all duration-300">
            <div className="p-8 border-b border-border">
              <h3 className="text-foreground font-bold text-lg uppercase tracking-wider">
                The Initiate
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Perfect for indie developers & side projects.
              </p>
              <div className="mt-6 flex flex-col gap-1.5 h-[52px] justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">$0</span>
                  <span className="text-muted-foreground text-xs font-medium">/mo</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-mono font-bold uppercase tracking-wider">
                  Free Forever
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between gap-8">
              <ul className="text-xs space-y-4 text-muted-foreground/90 font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">50 Active Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>{PRODUCT_CONFIG.FREE_CHECKS_LIMIT.toLocaleString()} free checks/mo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>60-Second Heartbeat checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>1 Public Status page</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Email & Discord dispatches</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>3 Days Log retention</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="flex w-full items-center justify-center h-10 bg-transparent border border-border hover:bg-accent text-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Tier 2: The Netrunner — "The Sleep Plan" */}
          <div className="bg-card border-2 border-primary/40 rounded-2xl flex flex-col relative shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transform md:-translate-y-2 hover:border-primary transition-all duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Moon className="size-3" />
              The Sleep Plan
            </div>

            <div className="p-8 border-b border-primary/20 bg-primary/5 rounded-t-2xl">
              <h3 className="text-primary font-bold text-lg uppercase tracking-wider">
                The Netrunner
              </h3>
              <p className="text-xs text-primary/70 mt-1">Solo devs who value their sleep.</p>
              <div className="mt-6 flex flex-col gap-1.5 h-[52px] justify-center">
                <div className="flex items-baseline gap-2">
                  {billing === "yearly" && (
                    <span className="text-sm line-through text-muted-foreground/50 font-mono">
                      $14
                    </span>
                  )}
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {billing === "yearly" ? "$11.66" : "$14"}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">/mo</span>
                </div>
                {billing === "yearly" && (
                  <span className="text-[10px] text-primary/80 font-mono font-bold uppercase tracking-wider">
                    Billed annually ($140) — Save $28
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between gap-8">
              <ul className="text-xs space-y-4 text-muted-foreground font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground font-semibold">200 Active Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground font-semibold">30-Second Heartbeat checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-primary font-semibold">
                    Real alerts only — if we call, it&apos;s real
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Multi-Region verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Anomalous latency indicators</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>SSL & Port monitoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>White-label Status pages</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>30 Days Logs & PDF reports</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=netrunner&billing=${billing}`}
                className="flex w-full items-center justify-center h-10 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          </div>

          {/* Tier 3: The Construct */}
          <div className="bg-card border border-border rounded-2xl flex flex-col relative hover:border-primary/20 transition-all duration-300">
            <div className="p-8 border-b border-border">
              <h3 className="text-foreground font-bold text-lg uppercase tracking-wider">
                The Construct
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enterprise reliability for professional teams.
              </p>
              <div className="mt-6 flex flex-col gap-1.5 h-[52px] justify-center">
                <div className="flex items-baseline gap-2">
                  {billing === "yearly" && (
                    <span className="text-sm line-through text-muted-foreground/50 font-mono">
                      $69
                    </span>
                  )}
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {billing === "yearly" ? "$57.50" : "$69"}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">/mo</span>
                </div>
                {billing === "yearly" && (
                  <span className="text-[10px] text-muted-foreground/60 font-mono font-bold uppercase tracking-wider">
                    Billed annually ($690) — Save $138
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between gap-8">
              <ul className="text-xs space-y-4 text-muted-foreground/90 font-medium">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Unlimited Monitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>10-Second HFT Heartbeat checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Full Global Pulse coverage (5 regions)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>SSO, SAML & Workspaces</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>PagerDuty & custom alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>Private status portals</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>1 Year Log retention</span>
                </li>
              </ul>

              <Link
                href={`/signup?plan=construct&billing=${billing}`}
                className="flex w-full items-center justify-center h-10 bg-transparent border border-border hover:bg-accent text-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Contact Enterprise
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-center text-xs text-muted-foreground border-t border-border/50 pt-10">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span> 14-day free trial on paid plans
          </div>
          <div className="hidden sm:block text-muted-foreground/30">•</div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span> No credit card required to start
          </div>
          <div className="hidden sm:block text-muted-foreground/30">•</div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span> Instant setup in less than 2 minutes
          </div>
        </div>
      </div>
    </section>
  );
}
