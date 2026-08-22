import type { Metadata } from "next";
import Pricing from "@/components/landing/pricing";
import FAQ from "@/components/landing/faq";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing & Plans — SteadyStack",
  description:
    "Simple, developer-friendly pricing options designed to scale with your backend infrastructure. Multi-region edge quorum verification, live latency tracking, and commercial use permitted in writing.",
  alternates: {
    canonical: "https://steadystack.dev/pricing",
  },
  openGraph: {
    title: "Pricing & Plans — SteadyStack",
    description:
      "Simple, developer-friendly pricing options designed to scale with your backend infrastructure. Multi-region edge quorum consensus, live latency tracking, and commercial use permitted in writing.",
    url: "https://steadystack.dev/pricing",
    siteName: "SteadyStack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans — SteadyStack",
    description:
      "Simple, developer-friendly pricing options designed to scale with your backend infrastructure. Multi-region edge quorum consensus, live latency tracking, and commercial use permitted in writing.",
    creator: "@steadystack",
  },
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Pricing />
      <FAQ />
    </div>
  );
}
