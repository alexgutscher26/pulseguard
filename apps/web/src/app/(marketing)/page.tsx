import type { Metadata } from "next";
import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/landing/pricing";
import HowItWorks from "@/components/landing/how-it-works";
import ComparisonTable from "@/components/landing/comparison-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SteadyStack — Know the second your stack breaks",
  description:
    "Know the second your stack breaks. Edge-native synthetic uptime monitoring that confirms failures across global regions before alerting. Multi-region edge quorum verification, live latency tracking, and zero false positives — free for commercial use.",
  alternates: {
    canonical: "https://steadystack.dev/",
  },
  openGraph: {
    title: "SteadyStack — Know the second your stack breaks",
    description:
      "Edge-native synthetic uptime monitoring that confirms failures across global regions before alerting. Multi-region edge quorum verification and zero false positives.",
    url: "https://steadystack.dev/",
    siteName: "SteadyStack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SteadyStack — Know the second your stack breaks",
    description:
      "Edge-native synthetic uptime monitoring that confirms failures across global regions before alerting. Multi-region edge quorum verification and zero false positives.",
    creator: "@steadystack",
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <ComparisonTable />
      <Pricing />
      <FAQ />
    </>
  );
}
