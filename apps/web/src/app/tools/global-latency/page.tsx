import type { Metadata } from "next";
import { LatencyChecker } from "./checker";
import LandingHeader from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Global Website Latency Test | PulseGuard Free Tools",
  description:
    "Instantly ping your website from 10 global locations. Check server latency, uptime, and regional performance for free.",
  keywords: [
    "website speed test",
    "global ping",
    "latency checker",
    "server status",
    "uptime check",
  ],
};

/**
 * Renders the Global Latency Checker page.
 */
export default function GlobalLatencyPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent pb-2">
              Global Latency Checker
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Test your website's performance from 10+ cities worldwide in real-time. Identify
              bottlenecks and ensure global availability.
            </p>
          </div>

          <LatencyChecker />
        </div>
      </main>
    </div>
  );
}
