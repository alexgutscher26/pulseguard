import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import { HeaderAnalyzer } from "./analyzer";

export const metadata: Metadata = {
  title: "HTTP Security Header Analyzer | PulseGuard",
  description:
    "Free HTTP header analyzer to audit website security. Scan HSTS, CSP, X-Frame-Options and more with our security sentinel tool.",
  openGraph: {
    title: "HTTP Security Header Analyzer",
    description:
      "Audit your website's security posture with PulseGuard's header analysis sentinel.",
    type: "website",
  },
};

export default function SecurityHeadersPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              HTTP Security Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono">
              [ANALYZING PROTOCOL INTEGRITY... ] Evaluate your endpoint's exposure via HTTP response
              header dissection.
            </p>
          </div>

          <HeaderAnalyzer />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Hardened HSTS
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Mandate secure tunnel transport. Prevents man-in-the-middle attacks by forcing
                browsers to use HTTPS exclusively.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Injected CSP
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Lock down your execution scope. Mitigates XSS and data injection vulnerabilities by
                defining trusted script sources.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Anti-Clickjacking
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Prevent UI redressing. Use X-Frame-Options to control frame rendering and block
                malicious overlay attacks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
