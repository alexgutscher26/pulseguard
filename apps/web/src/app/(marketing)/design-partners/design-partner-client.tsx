"use client";

import { useState, useEffect, useId } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  Loader2,
  Award,
  Users,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Activity,
  Globe2,
  Server,
  DollarSign,
  Search,
  KeyRound,
  HelpCircle,
  ChevronDown,
  Terminal,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCheck,
  AlertTriangle,
  Layers,
  Flame,
  Radio,
  FileCode2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import {
  submitDesignPartnerApplication,
  getDesignPartnerSpots,
  checkDesignPartnerStatus,
  redeemDesignPartnerCode,
} from "@/actions/design-partners";
import type { DesignPartnerSpotsInfo } from "@/actions/design-partners";

interface DesignPartnerClientProps {
  initialSpotsInfo?: DesignPartnerSpotsInfo;
  initialSpots?: number;
}

export default function DesignPartnerClient({
  initialSpotsInfo,
  initialSpots = 15,
}: DesignPartnerClientProps) {
  const [spotsInfo, setSpotsInfo] = useState<DesignPartnerSpotsInfo>(
    initialSpotsInfo || {
      totalSpots: 15,
      claimedSpots: 0,
      approvedSpots: 0,
      pendingSpots: 0,
      redeemedSpots: 0,
      remainingSpots: initialSpots,
    },
  );

  // Form state
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    monitorsCount: "10-50",
    currentTool: "UptimeRobot",
    techStack: "Next.js / Cloudflare / Node",
    socialHandle: "",
    painPoint: "",
    feedbackCommitment: true,
  });

  // Interactive ROI Calculator state
  const [calcMonitors, setCalcMonitors] = useState(50);
  const [calcInterval, setCalcInterval] = useState(30);

  // Status lookup & VIP key redemption state
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    record?: {
      id: string;
      name: string;
      company: string;
      website: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      vipCode?: string;
      redeemedAt?: string | null;
      createdAt: string;
    };
    error?: string;
  } | null>(null);

  const [redeemingKey, setRedeemingKey] = useState(false);
  const [copiedVip, setCopiedVip] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "apply" | "calculator" | "perks" | "status"
  >("apply");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const endpointsInputId = useId();
  const currentToolInputId = useId();
  const techStackInputId = useId();

  // Periodically refresh spots info
  useEffect(() => {
    getDesignPartnerSpots()
      .then((info) => {
        if (info && typeof info.remainingSpots === "number") {
          setSpotsInfo(info);
        }
      })
      .catch((err) => console.warn("Failed to fetch spots info:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.website) {
      toast.error("Please fill in your Name, Work Email, and Project URL");
      return;
    }

    if (
      !formData.website.startsWith("http://") &&
      !formData.website.startsWith("https://")
    ) {
      toast.error("Please enter a valid website URL starting with https://");
      return;
    }

    setLoading(true);
    const res = await submitDesignPartnerApplication(formData);
    setLoading(false);

    if (res.success) {
      setSubmittedId(res.vipCode || `dp_${Date.now()}`);
      if (typeof res.remainingSpots === "number") {
        setSpotsInfo((prev) => ({
          ...prev,
          remainingSpots: res.remainingSpots!,
        }));
      }
      setSubmitted(true);
      toast.success(res.message || "Application submitted successfully!");
    } else {
      toast.error(
        res.error || "Failed to submit application. Please check your inputs.",
      );
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      toast.error("Please enter your email or Application Reference ID");
      return;
    }

    setLookupLoading(true);
    const res = await checkDesignPartnerStatus(lookupQuery);
    setLookupLoading(false);
    setLookupResult(res);

    if (res.found) {
      toast.success("Application record retrieved!");
    } else {
      toast.error(res.error || "No application found for this query");
    }
  };

  const handleRedeemVipKey = async (code: string) => {
    if (!code) return;
    setRedeemingKey(true);
    const res = await redeemDesignPartnerCode(code);
    setRedeemingKey(false);

    if (res.success) {
      toast.success(
        res.message || "1-Year Netrunner Pro activated successfully!",
      );
      if (lookupResult?.record) {
        setLookupResult({
          ...lookupResult,
          record: {
            ...lookupResult.record,
            redeemedAt: new Date().toISOString(),
          },
        });
      }
    } else {
      toast.error(res.error || "Failed to activate VIP code");
    }
  };

  const handleCopy = (text: string, type: "id" | "vip") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      toast.success("Application Reference ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedVip(true);
      toast.success("VIP License Key copied to clipboard!");
      setTimeout(() => setCopiedVip(false), 2000);
    }
  };

  // ROI Calculator Calculations
  const datadogEstimatedCost = Math.round(
    calcMonitors * 1.5 * 12 * (calcInterval === 30 ? 1.5 : 1),
  );
  const betterStackEstimatedCost = Math.round(
    calcMonitors > 50 ? 29 * 12 + (calcMonitors - 50) * 1.2 * 12 : 29 * 12,
  );
  const pingdomEstimatedCost = Math.round(
    calcMonitors > 10 ? 45 * 12 + (calcMonitors - 10) * 2.0 * 12 : 45 * 12,
  );
  const steadystackPartnerCost = 0;
  const netrunnerProRetailValue = 228;
  const annualSavings = Math.max(
    netrunnerProRetailValue,
    betterStackEstimatedCost,
  );

  const faqs = [
    {
      q: "Who is eligible for the Design Partner Program?",
      a: "Any engineering team, indie hacker, agency, or founder running production web services, APIs, databases, or microservices. We evaluate applications based on active production workloads and commitment to provide launch-day feedback.",
    },
    {
      q: "Is a credit card required during application?",
      a: "No. Absolutely zero credit card, payment details, or pre-authorizations are ever required. Approved design partners receive a 100% complimentary VIP license key for 365 days of full Netrunner Pro access.",
    },
    {
      q: "What is expected in exchange for the 1-Year Pro license ($228 Value)?",
      a: "Only two things: (1) Set up and use SteadyStack for real uptime and latency monitoring, and (2) Provide a brief 15-minute feedback session or an honest 2-sentence testimonial on launch day for our Product Hunt & social proof directory.",
    },
    {
      q: "What happens after the 1-year complimentary period ends?",
      a: "You will NEVER be automatically billed or trapped. At the end of the year, you can choose to continue on a grandfathered founding-partner discount or downgrade to our generous free tier with zero disruption to your basic monitors.",
    },
    {
      q: "How fast are applications reviewed?",
      a: "Our founding engineering team reviews all applications in batches every 12 to 24 hours. Once approved, your VIP code is issued automatically, and you can look up or redeem it directly on this page.",
    },
    {
      q: "How does SteadyStack's multi-region edge verification work?",
      a: "When an endpoint returns a non-2xx status code or times out, our Cloudflare edge quorum immediately triggers secondary and tertiary validation checks across North America, Europe, and Asia-Pacific within milliseconds before dispatching alerts. This eliminates 99.4% of false alarms caused by localized transit blips.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Background Subtle Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-16 sm:gap-24">
        {/* ================= TELEMETRY TOP BAR & SPOTS BADGE ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">
                SteadyStack Edge Mesh:
              </span>
              <span className="hidden sm:inline">
                7 Sovereign Regions Operational
              </span>
              <span className="sm:hidden">7 Regions</span>
              <span className="text-border">|</span>
              <span className="text-primary font-bold">
                4-of-7 Quorum Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-mono">
              <Flame className="size-3.5 text-primary animate-pulse" />
              <span className="font-bold text-foreground">
                {spotsInfo.remainingSpots} of {spotsInfo.totalSpots}
              </span>
              <span className="text-muted-foreground text-[11px]">
                Spots Remaining
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTab("status");
                const el = document.getElementById("status-tab");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/60 hover:border-border transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              <span>Lookup Status</span>
            </button>
          </div>
        </div>

        {/* ================= COMMAND HERO SECTION ================= */}
        <section className="text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <Award className="size-4 text-primary" />
            Exclusive Founding Partner Tier
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            Deploy 1 Year of Enterprise Edge Monitoring —{" "}
            <span className="text-primary underline decoration-primary/40 underline-offset-8">
              On Us.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            We are selecting{" "}
            <span className="text-foreground font-semibold">
              15 fast-moving engineering teams
            </span>{" "}
            to receive{" "}
            <span className="text-foreground font-bold font-mono">
              1 full year of Netrunner Pro ($228 value)
            </span>{" "}
            at zero cost. In exchange, stress-test our Cloudflare edge mesh with
            real traffic and share your launch feedback.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-4">
            <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground font-mono">
                250
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                Active Monitors
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground font-mono">
                30s
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                Global Edge Checks
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground font-mono">
                $0
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                Full 365-Day License
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-emerald-500 font-mono">
                15
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                Slots Available
              </span>
            </div>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
            <a
              href="#application-cockpit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              Apply for Design Partner (60s) <ArrowRight className="size-4" />
            </a>

            <button
              onClick={() => {
                setActiveTab("calculator");
                const el = document.getElementById("calculator-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 bg-card border border-border text-foreground font-bold text-sm rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
            >
              <DollarSign className="size-4 text-emerald-500" />
              Calculate Annual Savings
            </button>
          </div>
        </section>

        {/* ================= INTERACTIVE NAVIGATION PILLS ================= */}
        <div className="flex items-center justify-center gap-2 flex-wrap border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "apply"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCode2 className="size-3.5" />
            Application Cockpit
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "calculator"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="size-3.5" />
            Savings Calculator
          </button>

          <button
            onClick={() => setActiveTab("perks")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "perks"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="size-3.5" />
            Pro Perks Matrix
          </button>

          <button
            id="status-tab"
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "status"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="size-3.5" />
            Lookup / Redeem Key
          </button>
        </div>

        {/* ================= CONDITIONAL TAB: STATUS LOOKUP & REDEEM ================= */}
        {activeTab === "status" && (
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono font-bold uppercase mb-1.5">
                  <KeyRound className="size-3" />
                  Applicant Self-Service
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Check Status & Redeem VIP Partner License
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter your work email or Application Reference ID to retrieve
                  your review status or activate your 1-Year Pro key.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("apply")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline cursor-pointer self-start sm:self-auto"
              >
                Back to Application
              </button>
            </div>

            {/* Lookup Input Form */}
            <form
              onSubmit={handleLookup}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. sarah@company.com or dp_17705492..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {lookupLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Check Application"
                )}
              </button>
            </form>

            {/* Lookup Result Display */}
            {lookupResult && (
              <div className="mt-2">
                {lookupResult.found && lookupResult.record ? (
                  <div className="p-5 rounded-2xl bg-background border border-border flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground text-sm">
                          {lookupResult.record.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          ({lookupResult.record.company})
                        </span>
                      </div>

                      {/* Status Tag */}
                      {lookupResult.record.status === "PENDING" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono font-bold">
                          <Clock className="size-3.5 animate-pulse" /> PENDING
                          REVIEW (Under 24h)
                        </div>
                      )}
                      {lookupResult.record.status === "APPROVED" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold">
                          <CheckCircle2 className="size-3.5" /> PARTNERSHIP
                          APPROVED!
                        </div>
                      )}
                      {lookupResult.record.status === "REJECTED" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                          <AlertTriangle className="size-3.5" /> NOT ACCEPTED
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground font-mono">
                          Application ID:{" "}
                        </span>
                        <span className="text-foreground font-mono font-semibold">
                          {lookupResult.record.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">
                          Submitted:{" "}
                        </span>
                        <span className="text-foreground font-mono">
                          {new Date(
                            lookupResult.record.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Approved Actions & VIP Code */}
                    {lookupResult.record.status === "APPROVED" &&
                      lookupResult.record.vipCode && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-mono font-bold uppercase text-emerald-500">
                              Your 1-Year VIP License Key:
                            </span>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono font-black text-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
                                {lookupResult.record.vipCode}
                              </code>
                              <button
                                onClick={() =>
                                  handleCopy(
                                    lookupResult.record!.vipCode!,
                                    "vip",
                                  )
                                }
                                className="p-1.5 rounded-lg border border-border hover:bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                title="Copy VIP Key"
                              >
                                {copiedVip ? (
                                  <Check className="size-4 text-emerald-500" />
                                ) : (
                                  <Copy className="size-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lookupResult.record.redeemedAt ? (
                              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                <CheckCheck className="size-4" /> Already
                                Activated on Account
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleRedeemVipKey(
                                    lookupResult.record!.vipCode!,
                                  )
                                }
                                disabled={redeemingKey}
                                className="inline-flex items-center gap-1.5 h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                              >
                                {redeemingKey ? (
                                  <>
                                    <Loader2 className="size-3.5 animate-spin" />{" "}
                                    Activating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="size-3.5" /> Activate
                                    1-Year Pro Now
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
                    {lookupResult.error ||
                      "No record found matching this query."}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ================= INTERACTIVE ROI & SAVINGS CALCULATOR ================= */}
        <section
          id="calculator-section"
          className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col gap-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-bold uppercase mb-2">
                <DollarSign className="size-3.5" />
                Transparent Economics
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Calculate Your Annual Monitoring Savings
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                See how much your engineering team saves with SteadyStack Design
                Partner status vs legacy uptime vendors.
              </p>
            </div>

            <div className="text-left sm:text-right bg-background p-4 rounded-2xl border border-border">
              <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                Estimated Annual Value
              </span>
              <span className="text-3xl font-black text-emerald-500 font-mono">
                ${annualSavings} / yr
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                (100% Free for Design Partners)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Interactive Sliders */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label
                    htmlFor={endpointsInputId}
                    className="font-bold text-foreground"
                  >
                    Active Endpoints / Services
                  </label>
                  <span className="text-primary font-bold text-sm">
                    {calcMonitors} Monitors
                  </span>
                </div>
                <input
                  id={endpointsInputId}
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={calcMonitors}
                  onChange={(e) => setCalcMonitors(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>5 Monitors</span>
                  <span>50</span>
                  <span>150</span>
                  <span>250 Max Pro</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-foreground">
                    Edge Check Frequency
                  </span>
                  <span className="text-primary font-bold text-sm">
                    {calcInterval} Seconds
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 180, 300].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setCalcInterval(sec)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        calcInterval === sec
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vendor Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground">
                  Datadog
                </span>
                <span className="text-xl font-black font-mono text-foreground">
                  ${datadogEstimatedCost}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  Per-check fees + synthetic overage surcharges.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground">
                  Better Stack
                </span>
                <span className="text-xl font-black font-mono text-foreground">
                  ${betterStackEstimatedCost}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  Base plan + additional team seat fees.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-bl-lg">
                  VIP PARTNER
                </div>
                <span className="text-xs font-bold text-primary">
                  SteadyStack
                </span>
                <span className="text-2xl font-black font-mono text-emerald-500">
                  $0.00
                </span>
                <span className="text-[10px] text-foreground font-semibold leading-tight">
                  1 Year Netrunner Pro ($228 retail) 100% Free.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DETAILED PRO PERKS MATRIX ================= */}
        <section className="flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              What You Unlock as a SteadyStack Design Partner
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything in our flagship Netrunner Pro tier, plus direct
              executive access to the engineering team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Globe2 className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                7-Region Quorum Consensus
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                4-of-7 multi-region verification eliminates false alarms. If a
                single region hiccups, independent nodes across North America,
                Europe, and Asia-Pacific verify before alerting.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Zap className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                250 Monitors & 30-Sec Intervals
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                HTTP/S, SSL certificate expiry, DNS propagation, cron job
                heartbeats, and WebSocket ping monitors with zero throttling.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Radio className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Multi-Channel Alert Dispatch
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instant incident broadcasts across Discord, Slack, Telegram,
                PagerDuty, Opsgenie, SMS, and custom JSON webhook webhooks.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Layers className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Custom Status Pages & CNAME
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Publish public or private branded status pages at{" "}
                <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded">
                  status.yourdomain.com
                </code>{" "}
                with custom CSS and uptime badges.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Users className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Private Founder War Room
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct Telegram / Discord private channel with SteadyStack core
                maintainers. Request custom features and get priority roadmap
                execution.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3.5 hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Sparkles className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Launch Spotlight & Backlink
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Featured partner badge, company logo, and do-follow link on our
                Product Hunt launch page, social channels, and partner showcase.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 3-STEP PROGRAM ROADMAP ================= */}
        <section className="bg-muted/30 border border-border rounded-3xl p-6 sm:p-10 flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              Simple 3-Phase Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              How the Design Partnership Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-primary">
                  01
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  60 SECONDS
                </span>
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Submit Workload Profile
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fill in your project URL, endpoint requirements, and monitoring
                pain points below. Verified within 24 hours.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-primary">
                  02
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                  INSTANT ACCESS
                </span>
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Activate 1-Year VIP License
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive your VIP code to instantly unlock 250 Netrunner Pro
                monitors, 30s checks, and custom status pages for 365 days.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-primary">
                  03
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  LAUNCH DAY
                </span>
              </div>
              <h3 className="font-bold text-foreground text-sm">
                Share Launch Testimonial
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide a quick 2-sentence review or 15-minute sync with the
                founders. Get featured prominently across our launch channels.
              </p>
            </div>
          </div>
        </section>

        {/* ================= THE APPLICATION COCKPIT ================= */}
        <section
          id="application-cockpit"
          className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center gap-5 max-w-md mx-auto animate-in zoom-in-95 duration-300">
              <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
                <CheckCircle2 className="size-9" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  Application Received!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Thank you for applying to the SteadyStack Design Partner
                  Program. Our founding team reviews every application within 24
                  hours.
                </p>
              </div>

              {/* Application Receipt Card */}
              <div className="w-full bg-background border border-border rounded-2xl p-4.5 flex flex-col gap-3 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">
                    Reference ID:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono font-bold text-foreground">
                      {submittedId}
                    </code>
                    <button
                      onClick={() => handleCopy(submittedId, "id")}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy Reference ID"
                    >
                      {copiedId ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">
                    Applicant Email:
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {formData.email}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">
                    Initial Status:
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Clock className="size-3 animate-pulse" /> PENDING REVIEW
                    (&lt;24h)
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3 text-left text-xs text-muted-foreground">
                <ShieldCheck className="size-5 text-primary shrink-0" />
                <span>
                  Once approved, your 1-Year VIP license key will be generated
                  and you can redeem it directly on this page or via dashboard.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-all"
                >
                  Go to Dashboard <ArrowRight className="size-4" />
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      company: "",
                      website: "",
                      monitorsCount: "10-50",
                      currentTool: "UptimeRobot",
                      techStack: "Next.js / Cloudflare / Node",
                      socialHandle: "",
                      painPoint: "",
                      feedbackCommitment: true,
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 bg-muted/40 border border-border text-muted-foreground hover:text-foreground font-bold text-xs rounded-xl hover:bg-muted transition-all cursor-pointer"
                >
                  Submit Another Project
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase mb-1">
                    <Terminal className="size-3.5" />
                    Application Intake
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    Apply for 1-Year Free Netrunner Pro
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Takes ~60 seconds. We review and approve workloads building
                    modern software products.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-mono self-start sm:self-auto">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-foreground font-bold">
                    {spotsInfo.remainingSpots} Slots Available
                  </span>
                </div>
              </div>

              {/* Section 1: Developer & Project Profile */}
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  01. Founder / Team Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Chen"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@yourcompany.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Company / Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HyperScale Labs"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Live Project URL / App Domain *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://app.yourcompany.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Infrastructure & Workload */}
              <div className="flex flex-col gap-4 pt-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  02. Infrastructure & Monitoring Scope
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={endpointsInputId}
                      className="text-xs font-mono font-semibold text-foreground"
                    >
                      Endpoints to Monitor
                    </label>
                    <select
                      id={endpointsInputId}
                      value={formData.monitorsCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monitorsCount: e.target.value,
                        })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans cursor-pointer"
                    >
                      <option value="1-10">1 - 10 microservices</option>
                      <option value="10-50">10 - 50 endpoints</option>
                      <option value="50-100">50 - 100 endpoints</option>
                      <option value="100-250">
                        100 - 250 (Full Pro Quota)
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={currentToolInputId}
                      className="text-xs font-mono font-semibold text-foreground"
                    >
                      Current Tool
                    </label>
                    <select
                      id={currentToolInputId}
                      value={formData.currentTool}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentTool: e.target.value,
                        })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans cursor-pointer"
                    >
                      <option value="UptimeRobot">UptimeRobot</option>
                      <option value="Better Stack">
                        Better Stack / Better Uptime
                      </option>
                      <option value="Checkly">Checkly</option>
                      <option value="Datadog / Pingdom">
                        Datadog / Pingdom
                      </option>
                      <option value="Freshping">Former Freshping User</option>
                      <option value="Custom Scripts">
                        Custom Scripts / None
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={techStackInputId}
                      className="text-xs font-mono font-semibold text-foreground"
                    >
                      Primary Tech Stack
                    </label>
                    <select
                      id={techStackInputId}
                      value={formData.techStack}
                      onChange={(e) =>
                        setFormData({ ...formData, techStack: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans cursor-pointer"
                    >
                      <option value="Next.js / Cloudflare / Node">
                        Next.js / Cloudflare / Node
                      </option>
                      <option value="Go / Rust / Microservices">
                        Go / Rust / Microservices
                      </option>
                      <option value="Python / FastAPI / Django">
                        Python / FastAPI / Django
                      </option>
                      <option value="Ruby on Rails / Postgres">
                        Ruby on Rails / Postgres
                      </option>
                      <option value="Docker / Kubernetes / Edge">
                        Docker / Kubernetes / Edge
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Top Pain Point / Monitoring Requirement (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eliminating false alarms, SSL alerts, or global latency"
                      value={formData.painPoint}
                      onChange={(e) =>
                        setFormData({ ...formData, painPoint: e.target.value })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-semibold text-foreground">
                      Twitter / X or GitHub Handle (For Launch Spotlight)
                    </label>
                    <input
                      type="text"
                      placeholder="@yourhandle or github.com/username"
                      value={formData.socialHandle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialHandle: e.target.value,
                        })
                      }
                      className="bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Commitment Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/80">
                <input
                  type="checkbox"
                  id="partner-commitment"
                  checked={formData.feedbackCommitment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feedbackCommitment: e.target.checked,
                    })
                  }
                  className="mt-0.5 size-4 accent-primary rounded cursor-pointer shrink-0"
                />
                <label
                  htmlFor="partner-commitment"
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                >
                  <strong className="text-foreground">
                    Founder's Agreement:
                  </strong>{" "}
                  I agree to use SteadyStack for real uptime monitoring and
                  share an honest 2-sentence testimonial on launch day in
                  exchange for 1 year of free Netrunner Pro ($228 value).
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Transmitting
                    Application...
                  </>
                ) : (
                  <>
                    Claim 1-Year Free Pro Access ($228 Value){" "}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* ================= FOUNDER LETTER & TRANSPARENCY NOTE ================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col md:flex-row gap-6 items-start">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Terminal className="size-6" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">
                A Note from the SteadyStack Maintainers
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                CORE TEAM
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              "Most uptime monitoring tools are either bloated enterprise
              dinosaurs or simple hobbyist wrappers around single-server ping
              scripts. We engineered SteadyStack natively on Cloudflare's global
              edge workers with distributed quorum consensus to eliminate false
              alarms forever.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We are providing 15 engineering teams with full 1-year Netrunner
              Pro licenses because real production workloads push our edge
              workers, latency metrics, and WebSocket alert dispatchers to their
              limit. Your feedback directly shapes our v1.0 launch."
            </p>
          </div>
        </section>

        {/* ================= INTERACTIVE FAQ ACCORDION ================= */}
        <section className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          <div className="text-center flex flex-col items-center gap-1 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase">
              <HelpCircle className="size-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Design Partner Program Details
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-bold text-foreground text-sm">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= FINAL FOOTER CALLOUT ================= */}
        <div className="text-center flex flex-col items-center gap-4 py-8 border-t border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
            <Check className="size-3.5" /> Ready for Production Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Have questions before applying?
          </h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <Link
              href={"https://pulse-41cf5b0d.mintlify.site/introduction" as any}
              className="hover:text-foreground underline"
            >
              Read the Docs
            </Link>
            <span>•</span>
            <Link
              href={"/comparison" as any}
              className="hover:text-foreground underline"
            >
              View Comparison Matrix
            </Link>
            <span>•</span>
            <a
              href="mailto:founders@steadystack.dev"
              className="hover:text-foreground underline"
            >
              Contact Founders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
