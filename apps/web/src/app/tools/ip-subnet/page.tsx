import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import { SubnetCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "IP Subnet Calculator | PulseGuard",
  description:
    "Free IP Subnet Calculator to visualize network masks, broadcast addresses, and host ranges. Decode binary bitmasks and optimize your infrastructure topology.",
  openGraph: {
    title: "IP Subnet Calculator",
    description:
      "Visualize and decompose your network topology with PulseGuard's IP pulse sentinel.",
    type: "website",
  },
};

export default function IPSubnetPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              Network Pulse Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-mono">
              [DECOMPOSING TOPOLOGY BITSETS... ] Instantly resolve address ranges, masks, and
              network geometry.
            </p>
          </div>

          <SubnetCalculator />
        </div>
      </main>
    </div>
  );
}
