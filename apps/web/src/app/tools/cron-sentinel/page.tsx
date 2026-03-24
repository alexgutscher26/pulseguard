import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import { CronSentinel } from "./builder";

export const metadata: Metadata = {
  title: "Cron Expression Generator & Debugger | PulseGuard",
  description: "Free cron expression generator and debugger for infrastructure monitoring. Visualize schedules, humanize cron strings, and plan next executions.",
  openGraph: {
    title: "Cron Expression Generator & Debugger",
    description: "Visualize and plan your monitoring schedule with PulseGuard's cron pulse sentinel.",
    type: "website",
  },
};

export default function CronSentinelPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              Cron Pulse Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-mono">
              [CALIBRATING EXECUTION ENGINE... ]
              Generate, debug, and visualize monitoring schedules with sub-second precision.
            </p>
          </div>

          <CronSentinel />
        </div>
      </main>
    </div>
  );
}
