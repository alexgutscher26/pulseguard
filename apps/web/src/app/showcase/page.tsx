import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import LandingFooter from "@/components/landing/footer";
import { ShowcaseGallery } from "./showcase-gallery";

export const metadata: Metadata = {
  title: "Cyberpunk Status Page Showcase | PulseGuard",
  description:
    "Browse beautifully designed cyberpunk-themed status pages from PulseGuard users. Get inspired and build your own.",
  openGraph: {
    title: "Cyberpunk Status Page Showcase",
    description: "See what PulseGuard status pages look like in the wild.",
  },
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />
      <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <ShowcaseGallery />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
