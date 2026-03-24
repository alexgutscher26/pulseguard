import type { Metadata } from "next";
import { VisualDiffComparator } from "./comparator";
import LandingHeader from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Visual Website Diff Tool | PulseGuard Free Tools",
  description:
    "Instantly compare two versions of a website to detect visual regressions, design shifts, or content updates. The ultimate tool for modern UI/UX monitoring.",
  keywords: [
    "visual diff",
    "website comparison",
    "regression testing",
    "UI monitoring",
    "website diff tool",
    "visual regression",
  ],
};

export default function VisualDiffPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              Visual Diff Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono">
              [ANALYZING DESIGN INTEGRITY...]
              <br />
              Compare two URLs to detect UI mutations with pixel-perfect precision.
            </p>
          </div>

          <VisualDiffComparator />
        </div>
      </main>
    </div>
  );
}
