"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Clock,
  Terminal,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { SAMPLE_INCIDENTS, type IncidentRecord } from "@/content/benchmarks-data";

export function IncidentExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<
    "all" | "steadystack" | "uptimerobot" | "pingdom"
  >("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "true_outage" | "spurious">("all");
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>("INC-2026-0604-02");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredIncidents = useMemo(() => {
    return SAMPLE_INCIDENTS.filter((item) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesEndpoint =
          item.endpointName.toLowerCase().includes(q) || item.endpointId.toLowerCase().includes(q);
        const matchesType = item.failureTypeLabel.toLowerCase().includes(q);
        const matchesPostMortem =
          item.postMortem.toLowerCase().includes(q) ||
          item.serverIngressSummary.toLowerCase().includes(q);
        if (!matchesEndpoint && !matchesType && !matchesPostMortem) return false;
      }

      // Type filter
      if (typeFilter !== "all" && item.failureType !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === "true_outage" && !item.groundTruthDown) return false;
      if (statusFilter === "spurious" && item.groundTruthDown) return false;

      // Provider filter
      if (providerFilter === "steadystack" && !item.steadystack.alertTriggered) return false;
      if (providerFilter === "uptimerobot" && !item.uptimerobot.alertTriggered) return false;
      if (providerFilter === "pingdom" && !item.pingdom.alertTriggered) return false;

      return true;
    });
  }, [searchQuery, typeFilter, statusFilter, providerFilter]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="incident-explorer"
      className="py-16 md:py-24 bg-background/50 border-b border-border relative"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
              <Terminal className="size-3" />
              Raw Audit Ledger
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Incident &amp; False Alarm Explorer
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Inspect ground-truth server logs, failure triggers, and multi-region consensus votes
              across every benchmark incident.
            </p>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{filteredIncidents.length}</strong> of{" "}
            {SAMPLE_INCIDENTS.length} key audit cases
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-sm mb-6 flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by endpoint, BGP flap, DNS, post-mortem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Providers</option>
            <option value="steadystack">SteadyStack Alerts Only</option>
            <option value="uptimerobot">UptimeRobot Alerts Only</option>
            <option value="pingdom">Pingdom Alerts Only</option>
          </select>

          {/* Failure Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Failure Types</option>
            <option value="true_outage">True Outage (Real Crash)</option>
            <option value="bgp_flap">BGP Route Flapping</option>
            <option value="dns_timeout">Local DNS Timeout</option>
            <option value="micro_drop">200ms Micro-Drop</option>
            <option value="tls_resets">TLS 1.3 Session Reset</option>
            <option value="chunk_timeout">Chunked Stream Timeout</option>
            <option value="single_transit_drop">Single-Transit Drop</option>
          </select>

          {/* Ground Truth Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Ground Truth States</option>
            <option value="true_outage">Ground Truth DOWN (Real)</option>
            <option value="spurious">Ground Truth UP (Spurious)</option>
          </select>
        </div>

        {/* Incident Table / List */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm divide-y divide-border/60">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs font-mono">
              No incidents match the active filter criteria. Reset filters to view all entries.
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const isExpanded = expandedIncidentId === incident.id;
              const isRealOutage = incident.groundTruthDown;

              return (
                <div key={incident.id} className="transition-colors hover:bg-muted/10">
                  {/* Summary Row */}
                  <div
                    onClick={() => setExpandedIncidentId(isExpanded ? null : incident.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {isRealOutage ? (
                        <div className="size-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                          <ShieldAlert className="size-4" />
                        </div>
                      ) : (
                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <ShieldCheck className="size-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {incident.id}
                          </span>
                          <span className="text-muted-foreground/60 text-xs font-mono">
                            • Day {incident.day}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border bg-muted/30 text-muted-foreground">
                            {incident.failureTypeLabel}
                          </span>
                        </div>
                        <span className="text-xs text-foreground font-medium mt-0.5 block">
                          {incident.endpointName}{" "}
                          <span className="text-muted-foreground font-mono text-[11px]">
                            ({incident.endpointId})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Verdicts Pill Row */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        {/* SteadyStack Status */}
                        <div
                          className={`px-2 py-0.5 rounded-md border ${
                            incident.steadystack.alertTriggered
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold"
                          }`}
                          title="SteadyStack Alert State"
                        >
                          PG: {incident.steadystack.alertTriggered ? "PAGED" : "REJECTED"}
                        </div>

                        {/* UptimeRobot Status */}
                        <div
                          className={`px-2 py-0.5 rounded-md border ${
                            incident.uptimerobot.alertTriggered
                              ? "border-rose-500/20 bg-rose-500/5 text-rose-400"
                              : "border-muted bg-muted/20 text-muted-foreground"
                          }`}
                          title="UptimeRobot Alert State"
                        >
                          UR: {incident.uptimerobot.alertTriggered ? "ALERT" : "OK"}
                        </div>

                        {/* Pingdom Status */}
                        <div
                          className={`px-2 py-0.5 rounded-md border ${
                            incident.pingdom.alertTriggered
                              ? "border-rose-500/20 bg-rose-500/5 text-rose-400"
                              : "border-muted bg-muted/20 text-muted-foreground"
                          }`}
                          title="Pingdom Alert State"
                        >
                          PD: {incident.pingdom.alertTriggered ? "ALERT" : "OK"}
                        </div>
                      </div>

                      {/* Expand Toggle */}
                      <button className="p-1 rounded-md text-muted-foreground hover:text-foreground">
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 bg-muted/15 border-t border-border/40 font-mono text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* SteadyStack Consensus Audit */}
                        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
                          <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
                            <span>SteadyStack Verdict</span>
                            <span>{incident.steadystack.timeToVerdictMs}ms</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-sans leading-relaxed mb-2">
                            {incident.steadystack.verdictDescription}
                          </p>
                          <div className="text-[10px] text-emerald-400/80">
                            Failed Nodes: {incident.steadystack.regionsFailed} /{" "}
                            {incident.steadystack.regionsTested} (Quorum target: 4)
                          </div>
                        </div>

                        {/* UptimeRobot Verdict */}
                        <div className="p-3.5 rounded-xl border border-border bg-card/60">
                          <div className="flex items-center justify-between text-sky-400 font-bold mb-2">
                            <span>UptimeRobot Verdict</span>
                            <span>{(incident.uptimerobot.timeToVerdictMs / 1000).toFixed(1)}s</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                            {incident.uptimerobot.verdictDescription}
                          </p>
                        </div>

                        {/* Pingdom Verdict */}
                        <div className="p-3.5 rounded-xl border border-border bg-card/60">
                          <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
                            <span>Pingdom Verdict</span>
                            <span>{(incident.pingdom.timeToVerdictMs / 1000).toFixed(1)}s</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                            {incident.pingdom.verdictDescription}
                          </p>
                        </div>
                      </div>

                      {/* Server Ingress & Post Mortem Box */}
                      <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-foreground text-[11px] uppercase tracking-wider">
                            Ground-Truth Server Ingress Audit (ClickHouse Ingress Log)
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isRealOutage
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {isRealOutage ? "GROUND TRUTH: DOWN" : "GROUND TRUTH: 100% HEALTHY"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                          {incident.serverIngressSummary}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground font-sans pt-1">
                        <div>
                          <strong className="text-foreground font-mono">Post-Mortem: </strong>
                          {incident.postMortem}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(incident.id, JSON.stringify(incident, null, 2));
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border bg-background"
                        >
                          {copiedId === incident.id ? (
                            <>
                              <Check className="size-3 text-emerald-400" />
                              Copied JSON
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              Copy Incident JSON
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
