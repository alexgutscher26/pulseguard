import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/landing/pricing";
import HowItWorks from "@/components/landing/how-it-works";
import ComparisonTable from "@/components/landing/comparison-table";

export const dynamic = "force-dynamic";

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
