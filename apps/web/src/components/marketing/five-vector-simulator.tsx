"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Radio,
  Clock,
  Globe2,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Moon,
  Terminal,
} from "lucide-react";

type ScenarioType = "blip" | "isp" | "flapping" | "outage";

interface VectorStep {
  id: number;
  name: string;
  componentCode: string;
  description: string;
  icon: typeof Radio;
  status: "success" | "failure" | "skipped" | "quarantined";
  latency: string;
  logDetail: string;
}

interface ScenarioConfig {
  id: ScenarioType;
  title: string;
  subtitle: string;
  category: "Noise Filtered" | "Storm Dampened" | "Critical Alert";
  description: string;
  outcomeType: "filtered" | "alert";
  outcomeBadge: string;
  outcomeTitle: string;
  outcomeDescription: string;
  devExperience: string;
  durationMs: string;
  vectors: VectorStep[];
}

const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  blip: {
    id: "blip",
    title: "2-Sec Socket Blip",
    subtitle: "Transient edge TCP timeout",
    category: "Noise Filtered",
    description:
      "A momentary TCP socket reset causes the initial Cloudflare Worker check to fail. Vector 2 pauses 1,000ms and re-tests before escalating.",
    outcomeType: "filtered",
    outcomeBadge: "🛡️ False Positive Neutralized",
    outcomeTitle: "Filtered at Vector 2 (Temporal Retrial)",
    outcomeDescription:
      "The initial drop cleared in under a second. The check is marked UP with zero alert noise.",
    devExperience: "Your phone stays silent. You stay asleep.",
    durationMs: "1,048ms",
    vectors: [
      {
        id: 1,
        name: "Primary Edge Probe",
        componentCode: "CF-EDGE-01",
        description: "Direct probe from nearest Cloudflare POP",
        icon: Radio,
        status: "failure",
        latency: "504ms",
        logDetail: "[V1] Initial check timed out (ECONNRESET)",
      },
      {
        id: 2,
        name: "Temporal Retrial",
        componentCode: "HOLD-1000MS",
        description: "1,000ms calibrated jitter hold re-evaluation",
        icon: Clock,
        status: "success",
        latency: "42ms",
        logDetail: "[V2] Temporal retry returned HTTP 200 OK — Socket healthy",
      },
      {
        id: 3,
        name: "Proxy Mesh Alpha",
        componentCode: "MESH-18-1-0",
        description: "Alternate cross-carrier BGP routing probe",
        icon: Globe2,
        status: "skipped",
        latency: "—",
        logDetail: "[V3] Bypassed — Target verified UP by Vector 2",
      },
      {
        id: 4,
        name: "Proxy Mesh Beta",
        componentCode: "MESH-18-1-1",
        description: "Secondary non-overlapping global proxy mesh",
        icon: Layers,
        status: "skipped",
        latency: "—",
        logDetail: "[V4] Bypassed — Target verified UP by Vector 2",
      },
      {
        id: 5,
        name: "High-Fidelity Anomaly Engine",
        componentCode: "CF-TRACE-19-3-1",
        description: "Statistical latency variance & trace consensus",
        icon: Cpu,
        status: "skipped",
        latency: "—",
        logDetail: "[V5] Bypassed — Outage debunked",
      },
    ],
  },
  isp: {
    id: "isp",
    title: "Regional ISP Hiccup",
    subtitle: "Transatlantic route degradation",
    category: "Noise Filtered",
    description:
      "A regional fiber cut degrades US-East routing. Local edge and retry fail, but European & Asian Mesh Proxies confirm your origin is responsive.",
    outcomeType: "filtered",
    outcomeBadge: "🌐 Regional Noise Filtered",
    outcomeTitle: "Filtered at Vector 3 (Mesh Proxy Alpha)",
    outcomeDescription:
      "European & Asian edge proxies verify your application is 100% healthy. Local ISP fault isolated.",
    devExperience: "No 3 AM wakeup for someone else's fiber cut.",
    durationMs: "1,220ms",
    vectors: [
      {
        id: 1,
        name: "Primary Edge Probe",
        componentCode: "CF-EDGE-01",
        description: "Direct probe from nearest Cloudflare POP",
        icon: Radio,
        status: "failure",
        latency: "5,000ms",
        logDetail: "[V1] US-East probe timed out (Host unreachable)",
      },
      {
        id: 2,
        name: "Temporal Retrial",
        componentCode: "HOLD-1000MS",
        description: "1,000ms calibrated jitter hold re-evaluation",
        icon: Clock,
        status: "failure",
        latency: "5,000ms",
        logDetail: "[V2] US-East local retry failed (Route unavailable)",
      },
      {
        id: 3,
        name: "Proxy Mesh Alpha",
        componentCode: "MESH-18-1-0",
        description: "Alternate cross-carrier BGP routing probe",
        icon: Globe2,
        status: "success",
        latency: "84ms",
        logDetail: "[V3] Mesh Alpha (Frankfurt) returned HTTP 200 OK — Origin online",
      },
      {
        id: 4,
        name: "Proxy Mesh Beta",
        componentCode: "MESH-18-1-1",
        description: "Secondary non-overlapping global proxy mesh",
        icon: Layers,
        status: "skipped",
        latency: "—",
        logDetail: "[V4] Bypassed — Mesh Alpha established origin viability",
      },
      {
        id: 5,
        name: "High-Fidelity Anomaly Engine",
        componentCode: "CF-TRACE-19-3-1",
        description: "Statistical latency variance & trace consensus",
        icon: Cpu,
        status: "skipped",
        latency: "—",
        logDetail: "[V5] Bypassed — False alarm suppressed",
      },
    ],
  },
  flapping: {
    id: "flapping",
    title: "Flapping Container",
    subtitle: "CrashLoopBackOff rapid bouncing",
    category: "Storm Dampened",
    description:
      "A Kubernetes container bounces UP and DOWN every 30 seconds. Anti-flapping hysteresis clamps repeated alerts into a single calm summary.",
    outcomeType: "filtered",
    outcomeBadge: "⚡ Alert Storm Quarantined",
    outcomeTitle: "Quarantined via Hysteresis & Circuit Breaker",
    outcomeDescription:
      "State toggled 4x in 3 minutes. Flapping suppression engaged. 20 pager notifications compressed into 1 grouped morning digest.",
    devExperience: "Your inbox isn't shredded with 40 spam notifications.",
    durationMs: "640ms",
    vectors: [
      {
        id: 1,
        name: "Primary Edge Probe",
        componentCode: "CF-EDGE-01",
        description: "Direct probe from nearest Cloudflare POP",
        icon: Radio,
        status: "quarantined",
        latency: "128ms",
        logDetail: "[V1] Target toggled UP->DOWN->UP (Delta: 24s)",
      },
      {
        id: 2,
        name: "Temporal Retrial",
        componentCode: "HOLD-1000MS",
        description: "1,000ms calibrated jitter hold re-evaluation",
        icon: Clock,
        status: "quarantined",
        latency: "96ms",
        logDetail: "[V2] Rapid state change detected. Flagged as Flapping state",
      },
      {
        id: 3,
        name: "Proxy Mesh Alpha",
        componentCode: "MESH-18-1-0",
        description: "Alternate cross-carrier BGP routing probe",
        icon: Globe2,
        status: "quarantined",
        latency: "140ms",
        logDetail: "[V3] Flap dampener active. Threshold: 3 transitions / 5 min exceeded",
      },
      {
        id: 4,
        name: "Proxy Mesh Beta",
        componentCode: "MESH-18-1-1",
        description: "Secondary non-overlapping global proxy mesh",
        icon: Layers,
        status: "quarantined",
        latency: "112ms",
        logDetail: "[V4] Circuit breaker throttles check interval to 5m cooldown",
      },
      {
        id: 5,
        name: "High-Fidelity Anomaly Engine",
        componentCode: "CF-TRACE-19-3-1",
        description: "Statistical latency variance & trace consensus",
        icon: Cpu,
        status: "quarantined",
        latency: "—",
        logDetail: "[V5] Consolidated single alert sent — Sub-alerts dampened",
      },
    ],
  },
  outage: {
    id: "outage",
    title: "Hard Production Outage",
    subtitle: "Real database or origin failure",
    category: "Critical Alert",
    description:
      "A fatal database crash knocks out production. All 5 vectors independently verify total unreachable status across global backbones.",
    outcomeType: "alert",
    outcomeBadge: "🚨 5/5 Consensus Reached",
    outcomeTitle: "Confirmed Outage: Escalation Dispatched",
    outcomeDescription:
      "All 5 vectors independently verified DOWN status in under 1.8 seconds. High-priority pager, SMS, and Telegram dispatched.",
    devExperience: "If we wake you up at 3 AM, it's 100% real.",
    durationMs: "1,780ms",
    vectors: [
      {
        id: 1,
        name: "Primary Edge Probe",
        componentCode: "CF-EDGE-01",
        description: "Direct probe from nearest Cloudflare POP",
        icon: Radio,
        status: "failure",
        latency: "48ms",
        logDetail: "[V1] HTTP 500 Internal Server Error (Database connection refused)",
      },
      {
        id: 2,
        name: "Temporal Retrial",
        componentCode: "HOLD-1000MS",
        description: "1,000ms calibrated jitter hold re-evaluation",
        icon: Clock,
        status: "failure",
        latency: "52ms",
        logDetail: "[V2] Retest confirmed persistent HTTP 500 error",
      },
      {
        id: 3,
        name: "Proxy Mesh Alpha",
        componentCode: "MESH-18-1-0",
        description: "Alternate cross-carrier BGP routing probe",
        icon: Globe2,
        status: "failure",
        latency: "116ms",
        logDetail: "[V3] Mesh Alpha (Frankfurt) confirmed DOWN (HTTP 500)",
      },
      {
        id: 4,
        name: "Proxy Mesh Beta",
        componentCode: "MESH-18-1-1",
        description: "Secondary non-overlapping global proxy mesh",
        icon: Layers,
        status: "failure",
        latency: "142ms",
        logDetail: "[V4] Mesh Beta (Tokyo) confirmed DOWN (HTTP 500)",
      },
      {
        id: 5,
        name: "High-Fidelity Anomaly Engine",
        componentCode: "CF-TRACE-19-3-1",
        description: "Statistical latency variance & trace consensus",
        icon: Cpu,
        status: "failure",
        latency: "78ms",
        logDetail: "[V5] CF Trace confirms 100% failure rate across global egress edges",
      },
    ],
  },
};

export function FiveVectorSimulator() {
  const [activeScenarioKey, setActiveScenarioKey] = useState<ScenarioType>("blip");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const scenario = SCENARIOS[activeScenarioKey];

  // Simulation run effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    setActiveStepIndex(0);
    setIsSimulating(true);

    const stepIntervals = [0, 400, 850, 1300, 1750, 2200];

    stepIntervals.forEach((delay, idx) => {
      timer = setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === scenario.vectors.length) {
          setIsSimulating(false);
        }
      }, delay);
    });

    return () => clearTimeout(timer);
  }, [activeScenarioKey, scenario.vectors.length]);

  const restartSimulation = () => {
    setActiveStepIndex(0);
    setIsSimulating(true);
    const stepIntervals = [0, 400, 850, 1300, 1750, 2200];
    stepIntervals.forEach((delay, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === scenario.vectors.length) {
          setIsSimulating(false);
        }
      }, delay);
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Scenario Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
              Live Pipeline Interactive Simulator
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            See the 5-Vector Verification Pipeline in Action
          </h3>
        </div>

        <button
          type="button"
          onClick={restartSimulation}
          disabled={isSimulating}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-border/70 bg-card hover:bg-muted/50 text-xs font-mono font-medium text-foreground transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RotateCcw className={`size-3.5 ${isSimulating ? "animate-spin" : ""}`} />
          <span>Replay Protocol</span>
        </button>
      </div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(SCENARIOS) as ScenarioType[]).map((key) => {
          const item = SCENARIOS[key];
          const isSelected = activeScenarioKey === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveScenarioKey(key)}
              className={`p-3.5 text-left border rounded-xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-primary/50 bg-primary/[0.04] ring-1 ring-primary/20 shadow-sm"
                  : "border-border/60 bg-card/60 hover:bg-card hover:border-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-foreground tracking-tight">
                    {item.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      item.outcomeType === "alert"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        : item.id === "flapping"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-primary/30 bg-primary/10 text-primary"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-primary/20 flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
                  <Zap className="size-3" />
                  <span>Simulating Protocol...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulation Board */}
      <div className="border border-border/80 bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 flex flex-col gap-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            scenario.outcomeType === "alert" ? "bg-rose-500/[0.05]" : "bg-primary/[0.05]"
          }`}
        />

        {/* HUD Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-card border border-border/60">
              <Terminal className="size-4 text-primary" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span>SCENARIO TARGET:</span>
                <span className="text-primary font-mono">https://api.solodev.app/health</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{scenario.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Consensus Latency
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                {scenario.durationMs}
              </span>
            </div>
            <div className="h-6 w-px bg-border/60" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Status</span>
              <span
                className={`text-xs font-mono font-bold ${
                  isSimulating
                    ? "text-amber-400"
                    : scenario.outcomeType === "alert"
                      ? "text-rose-400"
                      : "text-primary"
                }`}
              >
                {isSimulating ? "EVALUATING" : "CONSENSUS LOCKED"}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Vectors Interactive Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {scenario.vectors.map((vec, idx) => {
            const Icon = vec.icon;
            const isCompleted = activeStepIndex > idx;
            const isCurrent = activeStepIndex === idx && isSimulating;

            return (
              <motion.div
                key={vec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 relative ${
                  isCurrent
                    ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30 scale-[1.02]"
                    : isCompleted
                      ? vec.status === "success"
                        ? "border-primary/40 bg-primary/[0.03]"
                        : vec.status === "quarantined"
                          ? "border-amber-500/40 bg-amber-500/[0.03]"
                          : vec.status === "failure"
                            ? "border-rose-500/40 bg-rose-500/[0.03]"
                            : "border-border/40 bg-card/20 opacity-60"
                      : "border-border/40 bg-card/20 opacity-40"
                }`}
              >
                {/* Vector Header */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase">
                      Vector {vec.id}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground/70">
                      {vec.componentCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 rounded border transition-colors ${
                        isCompleted
                          ? vec.status === "success"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : vec.status === "quarantined"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              : vec.status === "failure"
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                : "border-border/40 bg-muted/20 text-muted-foreground"
                          : "border-border/40 bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <span className="text-xs font-bold text-foreground leading-tight">
                      {vec.name}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-tight mb-3">
                    {vec.description}
                  </p>
                </div>

                {/* Vector Footer Status */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground/80">{vec.latency}</span>
                  {isCurrent ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                      <Radio className="size-3 animate-spin" />
                      PROBING
                    </span>
                  ) : isCompleted ? (
                    vec.status === "success" ? (
                      <span className="text-primary font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        PASS (UP)
                      </span>
                    ) : vec.status === "quarantined" ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        DAMPENED
                      </span>
                    ) : vec.status === "failure" ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="size-3" />
                        DOWN
                      </span>
                    ) : (
                      <span className="text-muted-foreground/70">BYPASSED</span>
                    )
                  ) : (
                    <span className="text-muted-foreground/40">QUEUED</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Telemetry Log Stream */}
        <div className="bg-black/80 border border-border/60 rounded-xl p-3.5 font-mono text-[11px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/40 pb-1.5 mb-0.5">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              ENGINE CONSOLE TELEMETRY
            </span>
            <span>protocol_version: 5.4.1</span>
          </div>

          <div className="space-y-1">
            {scenario.vectors.map((vec, idx) => {
              if (activeStepIndex <= idx && isSimulating) return null;
              return (
                <div
                  key={vec.id}
                  className={`flex items-start gap-2 ${
                    vec.status === "success"
                      ? "text-emerald-400"
                      : vec.status === "quarantined"
                        ? "text-amber-400"
                        : vec.status === "failure"
                          ? "text-rose-400"
                          : "text-muted-foreground/50"
                  }`}
                >
                  <span className="text-muted-foreground/50 select-none">&gt;</span>
                  <span className="flex-1">{vec.logDetail}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol Outcome Card */}
        <AnimatePresence mode="wait">
          {!isSimulating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                scenario.outcomeType === "alert"
                  ? "border-rose-500/40 bg-rose-500/[0.06]"
                  : "border-primary/40 bg-primary/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg border mt-0.5 ${
                    scenario.outcomeType === "alert"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-primary/30 bg-primary/10 text-primary"
                  }`}
                >
                  {scenario.outcomeType === "alert" ? (
                    <AlertTriangle className="size-5" />
                  ) : (
                    <ShieldCheck className="size-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                      {scenario.outcomeBadge}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      • {scenario.outcomeTitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                    {scenario.outcomeDescription}
                  </p>
                </div>
              </div>

              {/* Dev Experience Badge */}
              <div className="sm:border-l sm:border-border/60 sm:pl-4 flex flex-col justify-center min-w-[200px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-0.5">
                  <Moon className="size-3.5 text-primary" />
                  <span>Solo Dev Result:</span>
                </div>
                <span className="text-[11px] font-mono text-primary font-medium">
                  {scenario.devExperience}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Proof Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="border border-border/60 bg-card/40 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-2xl font-extrabold text-foreground font-mono">99.4%</span>
          <span className="text-xs font-bold text-foreground">False-Positive Noise Filtered</span>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Transient socket resets and BGP drops intercepted before alerting.
          </p>
        </div>

        <div className="border border-border/60 bg-card/40 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-2xl font-extrabold text-primary font-mono">&lt; 1,800ms</span>
          <span className="text-xs font-bold text-foreground">5-Vector Consensus Time</span>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Full multi-vector mesh verification completes in under 2 seconds.
          </p>
        </div>

        <div className="border border-border/60 bg-card/40 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-2xl font-extrabold text-foreground font-mono">0</span>
          <span className="text-xs font-bold text-foreground">Phantom 3 AM Wakeups</span>
          <p className="text-[10px] text-muted-foreground leading-tight">
            If your pager sounds, your production database or container is actually down.
          </p>
        </div>
      </div>
    </div>
  );
}
