"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import { submitDesignPartnerApplication, getDesignPartnerSpots } from "@/actions/design-partners";

export default function DesignPartnerClient({ initialSpots = 15 }: { initialSpots?: number }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [vipCode, setVipCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(initialSpots);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    monitorsCount: "10-50",
    currentTool: "UptimeRobot",
    feedbackCommitment: true,
  });

  useEffect(() => {
    getDesignPartnerSpots()
      .then((info) => {
        if (typeof info.remainingSpots === "number") {
          setRemainingSpots(info.remainingSpots);
        }
      })
      .catch((err) => console.warn("Failed to fetch spots info:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.website) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const res = await submitDesignPartnerApplication(formData);
    setLoading(false);

    if (res.success) {
      setVipCode(res.vipCode || "");
      if (typeof res.remainingSpots === "number") {
        setRemainingSpots(res.remainingSpots);
      } else {
        setRemainingSpots((prev) => Math.max(1, prev - 1));
      }
      setSubmitted(true);
      toast.success(res.message || "Design Partner application submitted successfully!");
    } else {
      toast.error(res.error || "Failed to submit application. Please check your inputs.");
    }
  };

  const handleCopyCode = () => {
    if (!vipCode) return;
    navigator.clipboard.writeText(vipCode);
    setCopied(true);
    toast.success("VIP Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-mono font-bold uppercase tracking-wider">
          <Award className="size-3.5" />
          Exclusive Launch Program
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Become a <span className="text-primary">PulseGuard Design Partner</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
          Get{" "}
          <span className="text-foreground font-bold font-mono">
            1 Year of PulseGuard Netrunner Pro ($168 value) free
          </span>
          . In exchange, give us 15 minutes of real feedback and an honest review for launch day.
        </p>

        {/* Dynamic Spots counter */}
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-foreground font-bold">{remainingSpots} of 15 spots remaining</span>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <Zap className="size-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">1 Year Free Pro Access</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Full Netrunner tier features: 200 monitors, 30-second checks, multi-region verification,
            and custom status pages.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <Users className="size-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Direct Founder Access</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Private Telegram/Discord channel with our core engineers to request custom features and
            roadmap priority.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <Sparkles className="size-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Launch Spotlight</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Featured logo and testimonial on our Product Hunt launch page, landing page, and social
            proof directory.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {submitted ? (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <div className="size-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="size-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Application Under Review!</h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
              Thank you for applying! To ensure high-quality launch feedback, our founding team
              reviews applications within 24 hours. We've sent a confirmation notice to{" "}
              <span className="text-foreground font-semibold font-mono">{formData.email}</span>.
            </p>

            <div className="my-2 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-3 text-left max-w-md">
              <ShieldCheck className="size-5 text-amber-400 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Once approved by an admin, your 1-Year VIP Netrunner Pro license key will be issued
                and emailed automatically.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-primary/90 transition-all"
              >
                Go to Dashboard <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Apply for Design Partner Status</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Takes 60 seconds. We approve engineers and founders building active web
                applications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
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
                  placeholder="Acme SaaS"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Project URL / App Domain *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Active Endpoints to Monitor
                </label>
                <select
                  value={formData.monitorsCount}
                  onChange={(e) => setFormData({ ...formData, monitorsCount: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                >
                  <option value="1-10">1 - 10 monitors</option>
                  <option value="10-50">10 - 50 monitors</option>
                  <option value="50-200">50 - 200 monitors</option>
                  <option value="200+">200+ monitors</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Current Monitoring Solution
                </label>
                <select
                  value={formData.currentTool}
                  onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                >
                  <option value="UptimeRobot">UptimeRobot</option>
                  <option value="Better Stack">Better Stack / Better Uptime</option>
                  <option value="Checkly">Checkly</option>
                  <option value="Freshping">Former Freshping User</option>
                  <option value="Datadog / Pingdom">Datadog / Pingdom</option>
                  <option value="None">None / Custom Scripts</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="commitment"
                checked={formData.feedbackCommitment}
                onChange={(e) => setFormData({ ...formData, feedbackCommitment: e.target.checked })}
                className="mt-0.5 accent-primary"
              />
              <label
                htmlFor="commitment"
                className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
              >
                I agree to use PulseGuard for real uptime monitoring and provide an honest
                2-sentence review / feedback for launch day in exchange for 1 year of free Netrunner
                Pro.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 px-8 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-primary/90 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  Claim 1-Year Free Pro Access <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
