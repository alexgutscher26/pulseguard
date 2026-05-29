import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/landing/pricing";
import HowItWorks from "@/components/landing/how-it-works";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
    </>
  );
}
