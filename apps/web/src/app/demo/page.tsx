import Link from "next/link";
import DashboardClient from "@/app/(app)/dashboard/dashboard-client";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { DEMO_MONITORS, DEMO_STATS, DEMO_INSIGHTS, DEMO_ONBOARDING_STATUS } from "@/lib/demo-data";
import { ModeToggle } from "@/components/mode-toggle";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Product Demo & Sandbox | SteadyStack",
  description:
    "Explore SteadyStack's edge monitoring platform with live pre-seeded telemetry data. No signup required.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Demo Header Navigation */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground font-mono font-bold text-base hover:opacity-80 transition-opacity"
            >
              <div className="size-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Activity className="size-4 animate-pulse" />
              </div>
              <span>SteadyStack</span>
            </Link>
            <span className="text-border text-sm hidden sm:inline">/</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <span className="text-primary font-semibold">Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider font-bold">
                Live Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              <ArrowLeft className="size-3.5 mr-1" /> Back to Home
            </Link>
            <ModeToggle />
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-8 px-4 text-xs font-mono font-bold bg-primary text-primary-foreground hover:opacity-90 uppercase tracking-wider",
              )}
            >
              Get Started <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
        <DemoBanner />
        <DashboardClient
          monitors={DEMO_MONITORS}
          stats={DEMO_STATS}
          insights={DEMO_INSIGHTS}
          onboardingStatus={DEMO_ONBOARDING_STATUS}
          isDemo={true}
        />
      </main>
    </div>
  );
}
