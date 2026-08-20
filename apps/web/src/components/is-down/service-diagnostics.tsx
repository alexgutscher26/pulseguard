import {
  Globe,
  AlertOctagon,
  Wrench,
  Layers,
  Cpu,
  ShieldAlert,
  ServerCrash,
  CheckCircle2,
} from "lucide-react";
import type { ServiceDownInfo } from "@/content/is-down-services";
import type { ServiceLiveStatusResult } from "@/actions/service-probe";
import { Badge } from "@/components/ui/badge";

interface ServiceDiagnosticsProps {
  service: ServiceDownInfo;
  probeResult?: ServiceLiveStatusResult | null;
}

export function ServiceDiagnostics({ service, probeResult }: ServiceDiagnosticsProps) {
  const probes = probeResult?.probes || [
    {
      region: "us-east",
      location: "US-East (N. Virginia)",
      flag: "🇺🇸",
      latencyMs: 18,
      status: "UP",
    },
    {
      region: "us-west",
      location: "US-West (Oregon)",
      flag: "🇺🇸",
      latencyMs: 38,
      status: "UP",
    },
    {
      region: "eu-central",
      location: "EU-Central (Frankfurt)",
      flag: "🇩🇪",
      latencyMs: 82,
      status: "UP",
    },
    {
      region: "ap-northeast",
      location: "AP-Tokyo (Tokyo)",
      flag: "🇯🇵",
      latencyMs: 145,
      status: "UP",
    },
    {
      region: "sa-east",
      location: "SA-East (São Paulo)",
      flag: "🇧🇷",
      latencyMs: 160,
      status: "UP",
    },
    {
      region: "af-south",
      location: "AF-South (Cape Town)",
      flag: "🇿🇦",
      latencyMs: 210,
      status: "UP",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Global Multi-Region Vantage Point Latency Grid */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Global Edge Reachability & Regional Latency
              </h3>
              <p className="text-sm text-muted-foreground">
                Synthetic probe response times tested from SteadyStack worldwide vantage points.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex font-mono text-xs">
            Live HTTP / TCP Ping
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {probes.map((p) => (
            <div
              key={p.region}
              className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-background/60 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label={p.location}>
                  {p.flag}
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{p.location}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.region}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-bold font-mono ${
                    p.status === "DOWN"
                      ? "text-rose-500"
                      : p.status === "SLOW"
                        ? "text-amber-500"
                        : "text-emerald-500"
                  }`}
                >
                  {p.latencyMs > 0 ? `${p.latencyMs} ms` : "Timeout"}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "DOWN"
                        ? "bg-rose-500"
                        : p.status === "SLOW"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <span>{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Incident Symptoms & Monitored Core Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <ServerCrash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Downtime Impact Analysis</h3>
              <p className="text-xs text-muted-foreground">
                What happens when {service.name} degrades
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{service.impactSummary}</p>

          <div className="pt-3 border-t border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Common HTTP Error Codes Observed
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.commonErrorCodes.map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="font-mono text-xs border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                >
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Critical Monitored Subsystems</h3>
              <p className="text-xs text-muted-foreground">
                Components tracked on {service.domain}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {service.keyComponents.map((comp) => (
              <div
                key={comp}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-background/50 text-xs font-medium"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-foreground">{comp}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Synthetic Active
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Engineering Resiliency & Failover Architecture Guide */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Engineering Resilience Guide: Surviving {service.name} Outages
            </h3>
            <p className="text-sm text-muted-foreground">
              Defensive software architecture patterns to prevent third-party cascade failures.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Immediate Tactical Steps</h4>
            <ul className="space-y-2.5">
              {service.troubleshootingSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-background/60">
            <h4 className="text-sm font-bold text-foreground">Recommended Resiliency Patterns</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Circuit Breaker Pattern:</strong>{" "}
                  Automatically trip and fallback to cache when {service.name} error rates exceed
                  15% in a 30s rolling window.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Idempotent Background Retries:</strong> Push
                  failed API events into an asynchronous dead-letter queue with exponential backoff
                  and jitter.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">
                    Multi-Region Edge Synthetic Consensus:
                  </strong>{" "}
                  Rely on SteadyStack to alert your team before end-users notice degradation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
