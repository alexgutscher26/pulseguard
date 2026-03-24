import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import { PayloadTester } from "./tester";

export const metadata: Metadata = {
  title: "Regex Payload Monitor & Tester | PulseGuard",
  description: "Free regex tester for website monitoring. Verify HTML expectations, check for specific phrases, and validate payload integrity with our regex sentinel.",
  openGraph: {
    title: "Regex Payload Monitor & Tester",
    description: "Verify your website's content with PulseGuard's payload analysis sentinel.",
    type: "website",
  },
};

export default function PayloadTesterPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent pb-2 uppercase italic">
              Payload Pulse Regex Sentinel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-mono">
              [ANALYZING CONTENT STREAM... ]
              Define and test "Expectation" sequences for HTML payload monitoring.
            </p>
          </div>

          <PayloadTester />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-primary/10 pt-12">
            <div className="space-y-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
               <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                 Payload Extraction
               </h3>
               <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                 Seamlessly pulls raw HTML from any endpoint, bypassing common bot detection filters.
               </p>
            </div>
            <div className="space-y-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
               <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                 Regex Sequencing
               </h3>
               <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                 Test complex regular expressions to find titles, price tags, or error messages in code.
               </p>
            </div>
            <div className="space-y-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
               <h3 className="text-primary font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                 Incident Prevention
               </h3>
               <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                 Configure monitors to alert only when specific content is missing or found on the page.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
