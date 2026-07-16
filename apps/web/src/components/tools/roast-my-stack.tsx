"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Flame,
  Loader2,
  Globe,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  Server,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

interface RoastReport {
  url: string;
  overall: number; // 0–100
  summary: string;
  roast: string;
  checks: {
    name: string;
    label: string;
    status: "pass" | "warn" | "fail";
    value: string;
    detail: string;
    icon: "ssl" | "ttfb" | "dns" | "headers" | "server";
  }[];
}

const ICON_MAP = {
  ssl: Shield,
  ttfb: Clock,
  dns: Globe,
  headers: Activity,
  server: Server,
};

const OVERALL_LABELS = [
  { max: 30, label: "Yikes", color: "text-red-500", bg: "bg-red-500/10 border-red-500/30" },
  {
    max: 50,
    label: "Needs Work",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/30",
  },
  {
    max: 70,
    label: "Decent",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/30",
  },
  { max: 90, label: "Solid", color: "text-lime-500", bg: "bg-lime-500/10 border-lime-500/30" },
  { max: 100, label: "S-tier", color: "text-green-500", bg: "bg-green-500/10 border-green-500/30" },
];

function getOverallLabel(score: number) {
  return OVERALL_LABELS.find((l) => score <= l.max) ?? OVERALL_LABELS[OVERALL_LABELS.length - 1];
}

function ScoreGauge({ score }: { score: number }) {
  const label = getOverallLabel(score);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/20"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={label.color}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className={`text-2xl font-extrabold font-mono ${label.color}`}>{score}</span>
      <span
        className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 border ${label.bg} ${label.color}`}
      >
        {label.label}
      </span>
    </div>
  );
}

export function RoastMyStack() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RoastReport | null>(null);

  const normalizeUrl = (input: string) => {
    let cleaned = input
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .toLowerCase();
    return cleaned;
  };

  const runChecks = async () => {
    const domain = normalizeUrl(url);
    if (!domain) {
      toast.error("Enter a valid domain");
      return;
    }
    setLoading(true);
    setReport(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${WORKER_URL}/api/roast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        // Fallback: run client-side checks
        const fallback = await runClientChecks(domain);
        setReport(fallback);
        return;
      }

      const data: RoastReport = await res.json();
      setReport(data);
    } catch {
      const fallback = await runClientChecks(domain);
      setReport(fallback);
    } finally {
      setLoading(false);
    }
  };

  const runClientChecks = async (domain: string): Promise<RoastReport> => {
    const checks: RoastReport["checks"] = [];
    let totalScore = 50;
    const issues: string[] = [];

    // SSL check via fetch
    try {
      const start = Date.now();
      const sslRes = await fetch(`https://${domain}`, { method: "HEAD", mode: "no-cors" });
      const ms = Date.now() - start;
      if (sslRes.type === "opaque" || sslRes.status < 400) {
        checks.push({
          name: "ssl",
          label: "SSL/TLS",
          status: "pass",
          value: "Valid",
          detail: `Responded in ${ms}ms`,
          icon: "ssl",
        });
        totalScore += 10;
      } else {
        checks.push({
          name: "ssl",
          label: "SSL/TLS",
          status: "warn",
          value: "Mixed",
          detail: `Status ${sslRes.status}`,
          icon: "ssl",
        });
        issues.push("SSL response was unusual");
      }
    } catch {
      checks.push({
        name: "ssl",
        label: "SSL/TLS",
        status: "fail",
        value: "Unreachable",
        detail: "Could not establish HTTPS connection",
        icon: "ssl",
      });
      issues.push("Your site is not reachable over HTTPS");
    }

    // TTFB check via image timing
    try {
      const imgStart = performance.now();
      await fetch(`https://${domain}/favicon.ico`, { method: "GET", mode: "no-cors" });
      const ttfb = Math.round(performance.now() - imgStart);
      if (ttfb < 300) {
        checks.push({
          name: "ttfb",
          label: "TTFB",
          status: "pass",
          value: `${ttfb}ms`,
          detail: "Great response time",
          icon: "ttfb",
        });
        totalScore += 15;
      } else if (ttfb < 800) {
        checks.push({
          name: "ttfb",
          label: "TTFB",
          status: "warn",
          value: `${ttfb}ms`,
          detail: "Could be faster",
          icon: "ttfb",
        });
        issues.push(`TTFB of ${ttfb}ms is slow`);
      } else {
        checks.push({
          name: "ttfb",
          label: "TTFB",
          status: "fail",
          value: `${ttfb}ms`,
          detail: "Very slow response",
          icon: "ttfb",
        });
        issues.push(`TTFB of ${ttfb}ms is very slow`);
      }
    } catch {
      checks.push({
        name: "ttfb",
        label: "TTFB",
        status: "fail",
        value: "N/A",
        detail: "Could not measure",
        icon: "ttfb",
      });
    }

    // DNS check
    try {
      const dnsRes = await fetch(`${WORKER_URL}/api/dns-lookup?domain=${domain}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (dnsRes.ok) {
        const dnsData = (await dnsRes.json()) as { records?: unknown[] };
        if (dnsData.records && dnsData.records.length > 0) {
          checks.push({
            name: "dns",
            label: "DNS Records",
            status: "pass",
            value: `${dnsData.records.length} records`,
            detail: "DNS resolves correctly",
            icon: "dns",
          });
          totalScore += 10;
        } else {
          checks.push({
            name: "dns",
            label: "DNS Records",
            status: "warn",
            value: "Sparse",
            detail: "Very few DNS records found",
            icon: "dns",
          });
          issues.push("Low DNS record count");
        }
      } else {
        throw new Error("DNS lookup failed");
      }
    } catch {
      checks.push({
        name: "dns",
        label: "DNS Records",
        status: "fail",
        value: "Unresolved",
        detail: "DNS lookup failed — check your nameservers",
        icon: "dns",
      });
      issues.push("DNS is not resolving");
    }

    // Headers check
    try {
      const hRes = await fetch(`https://${domain}`, { method: "GET", mode: "no-cors" });
      const headers = hRes.headers;
      const hasSecurityHeaders =
        headers.get("strict-transport-security") ||
        headers.get("x-frame-options") ||
        headers.get("content-security-policy");
      if (hasSecurityHeaders) {
        checks.push({
          name: "headers",
          label: "HTTP Headers",
          status: "pass",
          value: "Secure",
          detail: "Security headers detected",
          icon: "headers",
        });
        totalScore += 10;
      } else {
        checks.push({
          name: "headers",
          label: "HTTP Headers",
          status: "warn",
          value: "Incomplete",
          detail: "Missing security headers (HSTS, CSP, XFO)",
          icon: "headers",
        });
        issues.push("Missing HSTS or CSP headers");
      }
    } catch {
      checks.push({
        name: "headers",
        label: "HTTP Headers",
        status: "fail",
        value: "N/A",
        detail: "Could not read headers",
        icon: "headers",
      });
    }

    totalScore = Math.min(100, Math.max(0, totalScore));

    // Generate roast
    let roast: string;
    if (totalScore >= 85) {
      roast = `Your stack at **${domain}** is surprisingly solid. SSL works, DNS resolves, headers are set. I'm actually a little disappointed — I was hoping to find a dumpster fire. Good job, I guess. 🙄`;
    } else if (totalScore >= 60) {
      roast = `**${domain}** is like a mid-tier developer's portfolio site: functional but uninspired. ${issues.slice(0, 2).join(". ")}. Your stack could use some tough love and a weekend of optimization.`;
    } else {
      roast = `Oh wow, **${domain}** is a beautiful disaster. ${issues.slice(0, 3).join(". ")}. Did you set this up in 5 minutes? Your stack is calling for help. Let's fix this.`;
    }

    let summary: string;
    if (totalScore >= 80) summary = "Your stack passes the vibe check.";
    else if (totalScore >= 50) summary = "Not terrible, but not great. You have room to improve.";
    else summary = "This stack needs an intervention.";

    return { url: domain, overall: totalScore, summary, roast, checks };
  };

  const isReportEmpty = !report || report.checks.length === 0;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="your-startup.io"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runChecks()}
            className="pl-9 font-mono text-sm h-11"
          />
        </div>
        <Button
          onClick={runChecks}
          disabled={loading}
          className="h-11 px-5 gap-1.5 text-xs font-bold uppercase tracking-wider"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Flame className="size-4" />}
          {loading ? "Roasting..." : "Roast It"}
        </Button>
      </div>

      {/* Report */}
      <AnimatePresence>
        {report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score + Summary */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <ScoreGauge score={report.overall} />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-medium text-foreground mb-1">{report.summary}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.roast}</p>
              </div>
            </div>

            {/* Checks */}
            <div className="grid sm:grid-cols-2 gap-3">
              {report.checks.map((check) => {
                const Icon = ICON_MAP[check.icon];
                return (
                  <Card
                    key={check.name}
                    className={`border bg-card/50 ${
                      check.status === "pass"
                        ? "border-green-500/15"
                        : check.status === "warn"
                          ? "border-yellow-500/15"
                          : "border-red-500/15"
                    }`}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <Icon className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {check.label}
                          </span>
                          {check.status === "pass" ? (
                            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                          ) : check.status === "warn" ? (
                            <AlertTriangle className="size-3.5 text-yellow-500 shrink-0" />
                          ) : (
                            <XCircle className="size-3.5 text-red-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {check.value}
                          </span>
                          <span className="text-[9px] text-muted-foreground/60">·</span>
                          <span className="text-[10px] text-muted-foreground/70 truncate">
                            {check.detail}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="border border-dashed border-primary/20 bg-primary/[0.02] p-5 text-center">
              <p className="text-[10px] font-mono text-muted-foreground mb-3">
                Want <span className="text-primary font-bold">real-time monitoring</span> for{" "}
                {report.url}? PulseGuard checks every 30 seconds and alerts you before users notice.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center justify-center h-8 px-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider gap-1 border border-primary hover:bg-primary/90 transition-all rounded-sm"
              >
                Start Monitoring <ArrowRight className="size-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
