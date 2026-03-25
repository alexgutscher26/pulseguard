import type { Metadata } from "next";
import { PortChecker } from "@/components/tools/port-checker";
import LandingHeader from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Open Port Checker Tool | PulseGuard",
  description:
    "Test if your ports are open and accessible from the internet. Check Minecraft (25565), SSH (22), Plex (32400) and more.",
  keywords: [
    "port checker",
    "open port test",
    "minecraft port check",
    "port forwarding test",
    "server status",
  ],
};

/**
 * Renders the Port Checker page with a header and main content.
 */
export default function PortCheckerPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-primary to-green-400 bg-clip-text text-transparent pb-2 font-mono">
              PORT_FORWARDING_TESTER
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono">
              &gt; Diagnostic tool for verifying external connectivity. <br />
              &gt; Supports standard services and custom TCP ports.
            </p>
          </div>

          <PortChecker />
        </div>
      </main>
    </div>
  );
}
