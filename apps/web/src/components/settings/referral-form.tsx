"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Mail,
  DollarSign,
  TrendingUp,
  MousePointer,
  Award,
  Loader2,
  Gift,
} from "lucide-react";
import { getReferralSummary, type ReferralSummary } from "@/actions/referrals";
import { toast } from "@/components/ui/sonner";

export function ReferralForm() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getReferralSummary()
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error("Failed to load referral summary:", err);
        toast.error("Could not load referral details.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = () => {
    if (!summary?.referralLink) return;
    navigator.clipboard.writeText(summary.referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    if (!summary?.referralLink) return;
    const text = encodeURIComponent(
      `Join me on PulseGuard for real-time Cloudflare-edge API & web monitoring! Get an extended trial using my referral link: ${summary.referralLink}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareLinkedin = () => {
    if (!summary?.referralLink) return;
    const url = encodeURIComponent(summary.referralLink);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleShareEmail = () => {
    if (!summary?.referralLink) return;
    const subject = encodeURIComponent("Try PulseGuard Cloud Monitoring");
    const body = encodeURIComponent(
      `Hey!\n\nI'm using PulseGuard for global endpoint monitoring. Sign up with my link to get full Pro features: ${summary.referralLink}\n\nCheers!`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-card border border-border rounded-xl">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-mono">Loading affiliate telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                PulseGuard Partner Network
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Gift className="size-3" />
                Affiliate Program
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Earn $10 for every teammate you refer
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Share your link with engineers & founders. They get extended trial access, and you
              earn $10 credit per paid subscriber.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link & Social Share Bar */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Share2 className="size-4 text-primary" />
          Your Unique Referral Link
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <input
              type="text"
              readOnly
              value={summary?.referralLink || "Loading..."}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none selection:bg-cyan-500/30"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {summary?.code}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            {copied ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-mono text-muted-foreground mr-2">Quick Share:</span>
          <button
            onClick={handleShareTwitter}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer"
            title="Share on X / Twitter"
          >
            <Twitter className="size-4" />
          </button>
          <button
            onClick={handleShareLinkedin}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-sky-400 transition-all cursor-pointer"
            title="Share on LinkedIn"
          >
            <Linkedin className="size-4" />
          </button>
          <button
            onClick={handleShareEmail}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
            title="Share via Email"
          >
            <Mail className="size-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Link Clicks</span>
            <MousePointer className="size-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">{summary?.clicks || 0}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Referred Signups</span>
            <Users className="size-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {summary?.totalReferred || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Paid Conversions</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {summary?.totalConverted || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Earned Credits</span>
            <DollarSign className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            ${summary?.totalEarned || 0}
          </p>
        </div>
      </div>

      {/* Referred Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Award className="size-4 text-primary" />
            Referral Activity History
          </h3>
          <span className="text-xs font-mono text-muted-foreground">
            {summary?.referrals.length || 0} Total Referred
          </span>
        </div>

        {summary?.referrals && summary.referrals.length > 0 ? (
          <div className="divide-y divide-border/60 overflow-x-auto">
            {summary.referrals.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between text-xs font-mono hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                    REF
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.maskedEmail}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Joined {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      item.status === "CONVERTED" || item.status === "REWARDED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="font-bold text-foreground min-w-[50px] text-right">
                    +${item.rewardAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <Users className="size-8 text-muted-foreground/40 mx-auto" />
            <p className="text-xs font-bold text-foreground">No referrals recorded yet</p>
            <p className="text-xs text-muted-foreground">
              Share your referral link above to start earning account credits!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
