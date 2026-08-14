"use client";

import { useState } from "react";
import {
  runGlobalpingDiagnostics,
  type GlobalpingDiagnosticReport,
} from "@/actions/global-diagnostics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Globe2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface GlobalDiagnosticsModalProps {
  url: string;
  monitorName: string;
  trigger?: React.ReactNode;
}

export function GlobalDiagnosticsModal({
  url,
  monitorName,
  trigger,
}: GlobalDiagnosticsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<GlobalpingDiagnosticReport | null>(null);

  const handleRunDiagnostics = async () => {
    setIsLoading(true);
    try {
      const res = await runGlobalpingDiagnostics(url);
      if (res.success && res.data) {
        setReport(res.data);
        toast.success(
          `Global diagnostics completed across ${res.data.totalProbes} locations`,
        );
      } else {
        toast.error(res.error || "Diagnostics failed to complete");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to execute global diagnostics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] md:h-8 px-3.5 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-mono text-[10px] uppercase tracking-wider"
          >
            <Globe2 className="size-3.5 mr-1.5" />
            Global Test (100+ Nodes)
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border p-6 sm:p-8">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-primary/10 border border-primary/20 text-primary uppercase">
              <Radio className="size-3 animate-pulse text-primary" />
              <span>Ad-Hoc Global Diagnostics (Globalping)</span>
            </div>
          </div>

          <DialogTitle className="text-xl font-bold font-mono tracking-tight flex items-center gap-2">
            <span>On-Demand Global Reachability</span>
            <span className="text-xs font-normal text-muted-foreground font-sans">
              ({monitorName})
            </span>
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Test reachability, TLS handshake times, and DNS latency from public
            vantage points across every continent. Use this ad-hoc tool for
            debugging CDN propagation and ISP routing issues.
          </DialogDescription>
        </DialogHeader>

        {/* Separation of Concerns Banner */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs flex items-start gap-3">
          <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              PulseGuard Architectural Guarantee
            </p>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Automated critical alerts, quorum consensus, and uptime SLAs run
              exclusively on PulseGuard&apos;s{" "}
              <strong>deterministic, geographically pinned edge mesh</strong>.
              Globalping is used strictly for manual, on-demand debugging to
              prevent external telemetry noise.
            </p>
          </div>
        </div>

        {/* Action / Trigger Bar */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border">
          <div className="space-y-0.5 truncate">
            <span className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">
              Target Endpoint
            </span>
            <p className="text-xs font-mono text-foreground font-medium truncate">
              {url}
            </p>
          </div>

          <Button
            onClick={handleRunDiagnostics}
            disabled={isLoading}
            size="sm"
            className="shrink-0 bg-primary text-primary-foreground text-xs font-medium px-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 mr-2 animate-spin" />
                Probing World...
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5 mr-2" />
                {report ? "Re-Run Test" : "Run Live Diagnostics"}
              </>
            )}
          </Button>
        </div>

        {/* Report Results */}
        {report && (
          <div className="space-y-6 pt-2">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  Probes Reached
                </span>
                <p className="text-base font-bold font-mono text-foreground">
                  {report.successfulProbes} / {report.totalProbes}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  Avg Latency
                </span>
                <p className="text-base font-bold font-mono text-primary">
                  {report.averageLatencyMs} ms
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  Fastest Region
                </span>
                <p className="text-base font-bold font-mono text-emerald-500">
                  {report.minLatencyMs} ms
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  Slowest Region
                </span>
                <p className="text-base font-bold font-mono text-amber-500">
                  {report.maxLatencyMs} ms
                </p>
              </div>
            </div>

            {/* Probe Results Table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="p-3 bg-muted/30 border-b border-border flex items-center justify-between text-xs font-mono font-bold">
                <span>Vantage Point</span>
                <span>Latency & Timing</span>
              </div>

              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto font-mono text-xs">
                {report.results.map((r, idx) => (
                  <div
                    key={`${r.city}-${idx}`}
                    className="p-3 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="text-base"
                        role="img"
                        aria-label={r.country}
                      >
                        {r.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {r.city}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({r.country})
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 truncate">
                          {r.asn} • {r.network}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div className="space-y-0.5">
                        <span
                          className={`font-bold ${
                            r.status === "OK"
                              ? "text-foreground"
                              : r.status === "SLOW"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {r.status === "FAILED"
                            ? "Failed"
                            : `${r.latencyMs} ms`}
                        </span>
                        {r.dnsMs !== undefined && (
                          <div className="text-[10px] text-muted-foreground">
                            DNS {r.dnsMs}ms{" "}
                            {r.tlsMs !== undefined ? `• TLS ${r.tlsMs}ms` : ""}
                          </div>
                        )}
                      </div>

                      <div className="w-5 flex justify-center">
                        {r.status === "OK" && (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        )}
                        {r.status === "SLOW" && (
                          <AlertTriangle className="size-4 text-amber-500" />
                        )}
                        {r.status === "FAILED" && (
                          <XCircle className="size-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
