import type { Metadata } from "next";
import { RoastMyStack } from "@/components/tools/roast-my-stack";
import LandingHeader from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Free Roast My Stack Analyzer | PulseGuard",
  description:
    "Get roasted by PulseGuard: analyze your stack for slow TTFB, weak SSL, missing DNS records, and more. Free instant audit.",
  keywords: [
    "website analyzer",
    "stack audit",
    "performance checker",
    "TTFB",
    "SSL health",
    "DNS check",
  ],
};

export default function RoastMyStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent pb-2">
              Roast My Stack
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Enter a URL and PulseGuard will ruthlessly analyze your tech stack. TTFB, SSL, DNS,
              headers &mdash; we check everything so you can fix what's broken.
            </p>
          </div>

          <RoastMyStack />
        </div>
      </main>
    </div>
  );
}
