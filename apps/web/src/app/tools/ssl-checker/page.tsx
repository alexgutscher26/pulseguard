import type { Metadata } from "next";
import { SSLChecker } from "@/components/tools/ssl-checker";
import LandingHeader from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Free SSL Certificate Checker | PulseGuard",
  description:
    "Analyze your SSL/TLS security health. Check for expired certificates, legacy protocols, and HSTS configuration issues instantly.",
  keywords: ["ssl checker", "tls health", "certificate expiry", "https check", "security scan"],
};

export default function SSLCheckerPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent pb-2">
              SSL Health & Security Check
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Scan your website's SSL/TLS configuration, verify certificate chain validity, and
              detect deprecated protocols in seconds.
            </p>
          </div>

          <SSLChecker />
        </div>
      </main>
    </div>
  );
}
