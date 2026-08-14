"use client";

import { useState } from "react";
import { CLOUDFLARE_PROBE_REGIONS, type Region } from "@pulseguard/shared";
import {
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Globe2,
  ShieldCheck,
  Radio,
  Server,
  Terminal,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface LocationsClientProps {
  probes: (Region & {
    status: string;
    currentLatency: number;
    measuredColo: string;
  })[];
}

export default function LocationsClient({ probes }: LocationsClientProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [filterContinent, setFilterContinent] = useState<string>("ALL");

  const continents = ["ALL", "North America", "Europe", "Asia Pacific"];

  const filteredProbes =
    filterContinent === "ALL" ? probes : probes.filter((p) => p.continent === filterContinent);

  const allIpv4 = Array.from(new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv4Ranges)));
  const allIpv6 = Array.from(new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv6Ranges)));

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header & Mission Banner */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
            <Radio className="size-3.5 animate-pulse text-primary" />
            <span>Radical Transparency • Live Telemetry</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Global Probe Locations & Allowlist
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            PulseGuard executes synthetic health checks from 7 geographically pinned Cloudflare edge
            regions. We publish our exact vantage points, ASNs, and IP ranges so you can allowlist
            our monitoring nodes in your firewall or WAF.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/api/locations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <Terminal className="size-3.5 text-primary" />
              <span>Raw JSON Endpoint (/api/locations)</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
            <button
              onClick={() => handleCopy([...allIpv4, ...allIpv6].join("\n"), "all-ips")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs"
            >
              {copiedSection === "all-ips" ? (
                <Check className="size-3.5 text-primary-foreground" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>
                {copiedSection === "all-ips" ? "Copied All Ranges!" : "Copy All CIDR Ranges"}
              </span>
            </button>
          </div>
        </div>

        {/* Quorum Mechanism Explainer Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-bold">The 4-of-7 Quorum Rule</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A customer endpoint is only declared <strong>DOWN</strong> when at least 4
                independent geographic regions confirm the failure within a 90-second window.
                Single-region packet loss or local transit drops are isolated as regional
                degradation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Server className="size-5" />
              </div>
              <h3 className="text-lg font-bold">Durable Object Pinning</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlike random cron rotators, our probe nodes run inside geographically pinned
                Cloudflare Durable Objects. Alarms self-schedule with defensive early rescheduling
                to guarantee zero dropped cycles.
              </p>
            </div>

            <div className="space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Activity className="size-5" />
              </div>
              <h3 className="text-lg font-bold">ASN & Flapping Isolation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Any probe experiencing 3 or more state transitions within 2 hours is classified as{" "}
                <span className="font-mono text-amber-500 font-semibold">FLAPPING</span> and
                automatically removed from the quorum consensus pool until transit stabilizes.
              </p>
            </div>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-primary" />
            <span className="text-sm font-bold">
              Active Edge Probe Matrix ({filteredProbes.length} Nodes)
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border text-xs font-medium">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setFilterContinent(c)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterContinent === c
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Probe Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProbes.map((probe) => {
            const isOnline = probe.status === "ONLINE";
            const isFlapping = probe.status === "FLAPPING";

            return (
              <div
                key={probe.code}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all flex flex-col justify-between gap-5 group shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" role="img" aria-label={probe.name}>
                        {probe.flag}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{probe.name}</h4>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {probe.city}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isOnline
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : isFlapping
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isOnline ? "bg-emerald-500" : isFlapping ? "bg-amber-500" : "bg-red-500"
                        }`}
                      />
                      <span>{probe.status}</span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-border/60">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">DO Hint</span>
                      <p className="font-bold text-foreground">{probe.code}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Measured POP
                      </span>
                      <p className="font-bold text-primary">{probe.measuredColo}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Network ASN
                      </span>
                      <p className="font-medium text-foreground">{probe.asn}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">Provider</span>
                      <p className="font-medium text-foreground">{probe.provider}</p>
                    </div>
                  </div>
                </div>

                {/* CIDR Allowlist Box */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>IPv4 / IPv6 Allowlist</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          [...probe.ipv4Ranges, ...probe.ipv6Ranges].join("\n"),
                          `probe-${probe.code}`,
                        )
                      }
                      className="hover:text-foreground transition-colors inline-flex items-center gap-1 text-[10px]"
                    >
                      {copiedSection === `probe-${probe.code}` ? (
                        <Check className="size-3 text-primary" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>{copiedSection === `probe-${probe.code}` ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-[11px] font-mono text-foreground/80 space-y-1 overflow-x-auto">
                    {probe.ipv4Ranges.map((ip) => (
                      <div key={ip}>{ip}</div>
                    ))}
                    {probe.ipv6Ranges.map((ip) => (
                      <div key={ip} className="text-muted-foreground">
                        {ip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete WAF Allowlist Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">WAF & Firewall Allowlist (Consolidated)</h3>
              <p className="text-xs text-muted-foreground">
                Add these CIDR ranges and User-Agent signature to Cloudflare WAF, AWS WAF, or Nginx:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        userAgent: "PulseGuard-Synthetic-Monitor/2.0 (+https://pulseguard.io/bot)",
                        ipv4: allIpv4,
                        ipv6: allIpv6,
                      },
                      null,
                      2,
                    ),
                    "full-json",
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-mono hover:bg-muted/80 transition-colors"
              >
                {copiedSection === "full-json" ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>Copy JSON Spec</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                IPv4 CIDR Blocks
              </span>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border font-mono text-xs space-y-1.5">
                {allIpv4.map((cidr) => (
                  <div key={cidr} className="text-foreground">
                    {cidr}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                IPv6 CIDR Blocks & Bot Header
              </span>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border font-mono text-xs space-y-3">
                <div className="space-y-1.5">
                  {allIpv6.map((cidr) => (
                    <div key={cidr} className="text-foreground">
                      {cidr}
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">
                    User-Agent Header
                  </span>
                  <div className="text-[11px] text-primary break-all">
                    Mozilla/5.0 (compatible; PulseGuard-Synthetic-Monitor/2.0;
                    +https://pulseguard.io/bot)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
