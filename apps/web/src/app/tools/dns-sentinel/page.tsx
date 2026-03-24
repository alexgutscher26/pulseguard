import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import { DNSAnalyzer } from "./analyzer";

export const metadata: Metadata = {
  title: "MX & DNS Record Lookup Analyzer | PulseGuard",
  description: "Free MX and DNS record lookup tool to audit SPF/DKIM/DMARC health scores. Verify email deliverability and security with PulseGuard's DNS sentinel.",
  openGraph: {
    title: "MX & DNS Record Lookup Analyzer",
    description: "Audit your domain's email security and deliverability with PulseGuard's DNS pulse sentinel.",
    type: "website",
  },
};

export default function DNSSentinelPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-green-500 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              DNS Pulse Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-mono">
              [RESOLVING ENDPOINT RECORDSETS... ]
              Evaluate your domain's email deliverability and security integrity.
            </p>
          </div>

          <DNSAnalyzer />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">MX</div>
               <h3 className="text-sm font-mono font-bold uppercase tracking-widest">Mail Exchange Extraction</h3>
               <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                 Verify authoritative servers to ensure your domain can receive mail. Essential for identifying configuration gaps.
               </p>
            </div>
            <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">SPF</div>
               <h3 className="text-sm font-mono font-bold uppercase tracking-widest">Sender Policy Verification</h3>
               <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                 Check for strict policy enforcement (-all) to prevent unauthorized IPs from spoofing your endpoint.
               </p>
            </div>
            <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">DMARC</div>
               <h3 className="text-sm font-mono font-bold uppercase tracking-widest">DMARC Integrity Score</h3>
               <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                 Audit your reporting and enforcement policies. Advanced deliverability requires p=reject or p=quarantine.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
