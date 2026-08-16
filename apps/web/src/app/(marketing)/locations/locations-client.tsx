"use client";

import { useState } from "react";
import {
  CLOUDFLARE_PROBE_REGIONS,
  type Region,
  PULSEGUARD_CANONICAL_USER_AGENT,
} from "@pulseguard/shared";
import {
  Copy,
  Check,
  ShieldCheck,
  Radio,
  AlertTriangle,
  Activity,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface LocationsClientProps {
  probes: (Region & {
    status: string;
    currentLatency: number;
    measuredColo: string;
    lastCheck?: string;
  })[];
}

export default function LocationsClient({ probes }: LocationsClientProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const healthyCount = probes.filter((p) => p.status === "ONLINE").length;
  const flappingProbes = probes.filter((p) => p.status === "FLAPPING");
  const excludedRegionText =
    flappingProbes.length > 0 ? flappingProbes.map((p) => p.code).join(", ") : null;

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const allowlistSnippet = `# 1. Cloudflare WAF Custom Rule (Recommended)
# Our synthetic probes run as Cloudflare Durable Objects.
# Subrequests include an authentic, un-spoofable CF-Worker header.
#
# Match Expression:
(http.request.headers["cf-worker"][0] eq "pulseguard.io")
# Action: Skip / Bypass WAF & Rate Limiting

# 2. General WAF & Reverse Proxy Headers (Fastly / AWS WAF / Nginx)
CF-Worker: pulseguard.io
User-Agent: ${PULSEGUARD_CANONICAL_USER_AGENT}`;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="space-y-4 text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
            <Radio className="size-3.5 text-primary animate-pulse" />
            <span>Transparency</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Every place we check from.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Live status of our seven Cloudflare edge regions plus out-of-band sentinel nodes on
            independent ASNs (Hetzner AS24940). Updated continuously. Multi-ASN quorum verification
            guarantees that a single-cloud provider outage never triggers false customer alerts.
          </p>
        </div>

        {/* Live Probe Table */}
        <div className="space-y-4">
          <div className="border border-border bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 sm:p-5">Region</th>
                    <th className="p-4 sm:p-5">Covers</th>
                    <th className="p-4 sm:p-5">Network</th>
                    <th className="p-4 sm:p-5">Status</th>
                    <th className="p-4 sm:p-5">Last check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-sans text-xs">
                  {probes.map((probe) => {
                    const isOnline = probe.status === "ONLINE";
                    const isFlapping = probe.status === "FLAPPING";

                    return (
                      <tr key={probe.code} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 sm:p-5 font-mono font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{probe.flag}</span>
                            <span>{probe.code}</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-foreground font-medium">{probe.covers}</td>
                        <td className="p-4 sm:p-5 font-mono text-muted-foreground text-[11px]">
                          {probe.asn} ({probe.provider})
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              isOnline
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : isFlapping
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isOnline
                                  ? "bg-emerald-500"
                                  : isFlapping
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {probe.status}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-mono text-muted-foreground text-[11px]">
                          {probe.lastCheck || "Just now"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Dynamic Live Quorum Note */}
            <div className="p-4 sm:p-5 bg-muted/20 border-t border-border font-mono text-xs text-muted-foreground flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-foreground">Multi-ASN Quorum:</strong> 4 of {healthyCount}{" "}
                healthy regions plus independent ASN verification must confirm a failure before an
                incident opens.{" "}
                {excludedRegionText ? (
                  <span>
                    <strong className="text-amber-500">{excludedRegionText}</strong> is excluded
                    automatically until it stabilises — a probe that can&apos;t agree with itself
                    doesn&apos;t get a vote.
                  </span>
                ) : (
                  <span>
                    All probe nodes across Cloudflare and independent ASN sentinels are currently
                    healthy and participating in active quorum.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Allowlist Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Allowlist our probes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our synthetic probes originate from Cloudflare Durable Objects. Because serverless
              edge runtimes egress via Cloudflare&apos;s shared global edge IP pool, IP allowlisting
              is neither deterministic nor secure. Instead, configure your WAF or reverse proxy to
              match on our cryptographic{" "}
              <code className="text-primary font-mono font-semibold">CF-Worker: pulseguard.io</code>{" "}
              header and verified{" "}
              <code className="text-primary font-mono font-semibold">User-Agent</code>.
            </p>
          </div>

          <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 p-5 font-mono text-xs text-zinc-300 overflow-x-auto">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-zinc-800 text-[11px] text-zinc-500">
              <span>WAF Allowlist Configuration Spec</span>
              <button
                onClick={() => handleCopy(allowlistSnippet, "spec")}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer"
              >
                {copiedSection === "spec" ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copiedSection === "spec" ? "Copied" : "Copy Spec"}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all leading-relaxed text-zinc-200">
              {allowlistSnippet}
            </pre>
          </div>

          {/* Quick Copy Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleCopy("CF-Worker: pulseguard.io", "cf-worker")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border text-xs font-mono font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              {copiedSection === "cf-worker" ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>
                {copiedSection === "cf-worker" ? "Copied Header" : "Copy CF-Worker Header"}
              </span>
            </button>

            <button
              onClick={() =>
                handleCopy("PulseGuard-Monitor/1.0 (+https://pulseguard.io/bot)", "user-agent")
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border text-xs font-mono font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              {copiedSection === "user-agent" ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>
                {copiedSection === "user-agent" ? "Copied User-Agent" : "Copy User-Agent"}
              </span>
            </button>

            <button
              onClick={() =>
                handleCopy('http.request.headers["cf-worker"][0] eq "pulseguard.io"', "waf-rule")
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border text-xs font-mono font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              {copiedSection === "waf-rule" ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>
                {copiedSection === "waf-rule" ? "Copied WAF Rule" : "Copy Cloudflare WAF Rule"}
              </span>
            </button>

            <a
              href="/api/locations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-mono font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <Terminal className="size-3.5 text-primary" />
              <span>/api/locations</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Coverage Gap & Probe Health Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coverage Gap Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Coverage we don&apos;t have</h3>
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  South America, Africa, the Middle East, Oceania. Our probe regions run on
                  Cloudflare&apos;s network, which does not currently place workloads in those
                  regions — so we don&apos;t claim them.
                </p>
                <p>
                  What this means practically: a genuine outage still pages you, because your
                  endpoint will fail from all seven regions regardless of where it&apos;s hosted.
                  What we&apos;d miss is a problem affecting only users in those regions — a São
                  Paulo CDN edge, an African transit route. If that&apos;s a real risk for your
                  traffic, tell us; it moves our roadmap, and we&apos;ll say so here when it ships.
                </p>
              </div>
            </div>
          </div>

          {/* Probe Health Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Activity className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                When a probe goes bad, we say so
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  A monitoring probe with a bad network path reports failures that aren&apos;t real
                  — the industry&apos;s most common source of false alarms. Any probe with three or
                  more state transitions in two hours is marked Flapping and automatically removed
                  from quorum until it stabilises.
                </p>
                <p>
                  Every probe also reports on a heartbeat channel separate from its measurement
                  path, so a probe that&apos;s blocked is distinguishable from one that&apos;s
                  crashed. All of it is visible above, in real time, including when it&apos;s our
                  fault.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
