"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Trophy,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { updateLeaderboardPrivacy } from "@/actions/privacy";
import { toast } from "@/components/ui/sonner";

interface ShowcaseSubmitPanelProps {
  /** Slug of the status page — used to build the badge embed URL */
  pageSlug: string;
  /** Whether the user is already opted in to the Hall of Fame */
  defaultOptedIn?: boolean;
  /** Existing leaderboard bio */
  defaultBio?: string;
}

function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), resetMs);
  }
  return { copied, copy };
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-mono text-muted-foreground/70 uppercase tracking-wider">
        {label}
      </p>
      <div className="relative group">
        <pre className="bg-black/60 border border-white/10 rounded-sm p-3 pr-10 text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
          {code}
        </pre>
        <button
          type="button"
          onClick={() => copy(code)}
          className="absolute top-2 right-2 p-1 rounded-sm border border-white/10 bg-black/40 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3 text-green-400" />
          ) : (
            <Copy className="size-3 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

export function ShowcaseSubmitPanel({
  pageSlug,
  defaultOptedIn = false,
  defaultBio = "",
}: ShowcaseSubmitPanelProps) {
  const [optedIn, setOptedIn] = useState(defaultOptedIn);
  const [bio, setBio] = useState(defaultBio);
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Keep local state in sync with parent prop changes (e.g. after page reload)
  useEffect(() => {
    setOptedIn(defaultOptedIn);
    setBio(defaultBio);
  }, [defaultOptedIn, defaultBio]);

  function handleToggleOptIn() {
    const next = !optedIn;
    startTransition(async () => {
      try {
        await updateLeaderboardPrivacy(next, bio);
        setOptedIn(next);
        toast.success(
          next
            ? "You're now listed on the Hall of Fame!"
            : "Removed from Hall of Fame.",
        );
      } catch {
        toast.error("Failed to update Hall of Fame settings.");
      }
    });
  }

  function handleBioSave() {
    startTransition(async () => {
      try {
        await updateLeaderboardPrivacy(optedIn, bio);
        toast.success("Bio saved.");
      } catch {
        toast.error("Failed to save bio.");
      }
    });
  }

  // Badge embed strings
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://app.pulseguard.dev";

  const badgeUrl = `${appUrl}/api/badge/powered-by?theme=dark&style=flat&size=sm`;
  const statusBadgeUrl = `${appUrl}/api/badge/${pageSlug}?theme=dark&style=flat`;
  const statusPageUrl = `${appUrl}/status/${pageSlug}`;

  const markdownPowered = `[![Powered by PulseGuard](${badgeUrl})](${appUrl})`;
  const htmlPowered = `<a href="${appUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${badgeUrl}" alt="Powered by PulseGuard" />\n</a>`;
  const markdownStatus = `[![Status](${statusBadgeUrl})](${statusPageUrl})`;
  const htmlStatus = `<a href="${statusPageUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${statusBadgeUrl}" alt="Status" />\n</a>`;

  return (
    <div className="space-y-4">
      {/* Hall of Fame Opt-in */}
      <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
          <Trophy className="size-4 text-yellow-500" />
          Hall of Fame
        </h3>

        <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
          Opt this status page into the public Hall of Fame. Your weighted SLA
          across all monitors will be ranked against the community. Only
          accounts with 100+ checks qualify.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between bg-black/30 p-3 rounded-sm border border-white/5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Show on Hall of Fame Leaderboard
            </p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Your name, uptime %, and monitor count will be visible publicly.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleOptIn}
            disabled={isPending}
            className={`relative w-10 h-5 rounded-full border transition-all flex items-center shrink-0 ${
              optedIn
                ? "bg-primary border-primary shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                : "bg-black/50 border-white/10"
            }`}
            aria-pressed={optedIn}
            aria-label="Toggle Hall of Fame opt-in"
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin mx-auto text-muted-foreground" />
            ) : (
              <span
                className={`absolute size-3.5 rounded-full bg-white transition-transform shadow-sm ${
                  optedIn ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            )}
          </button>
        </div>

        {/* Bio */}
        {optedIn && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Leaderboard Bio{" "}
              <span className="text-muted-foreground normal-case tracking-normal font-normal">
                (optional — shown under your name)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={120}
                placeholder="e.g. Founder of Acme SaaS — 99.99% SLA since 2023"
                className="flex-1 bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleBioSave}
                disabled={isPending}
                className="px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all rounded-sm disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              {bio.length}/120 characters
            </p>
          </div>
        )}

        <a
          href="/hall-of-fame"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-mono text-primary/70 hover:text-primary transition-colors"
        >
          <ExternalLink className="size-3" />
          View Hall of Fame →
        </a>
      </div>

      {/* Powered by PulseGuard Badge */}
      <div className="bg-card/20 border border-primary/10 rounded-sm">
        <button
          type="button"
          onClick={() => setBadgeExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            "Powered by PulseGuard" Badge
          </h3>
          {badgeExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {badgeExpanded && (
          <div className="px-6 pb-6 space-y-5 border-t border-white/5 pt-4">
            <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
              Add these badges to your README, website, or docs to show your
              infrastructure is monitored by PulseGuard. Click any badge to copy
              the embed code.
            </p>

            {/* Live previews */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider">
                Badge Preview
              </p>
              <div className="flex flex-wrap gap-3 items-center bg-black/40 border border-white/5 rounded-sm p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${badgeUrl}`}
                  alt="Powered by PulseGuard"
                  className="h-5"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${badgeUrl}&style=outline`}
                  alt="Powered by PulseGuard outline"
                  className="h-5"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${badgeUrl}&size=lg`}
                  alt="Powered by PulseGuard large"
                  className="h-8"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${statusBadgeUrl}`} alt="Status" className="h-5" />
              </div>
            </div>

            {/* Embed codes */}
            <div className="grid gap-4">
              <CodeBlock
                label="Powered by PulseGuard — Markdown"
                code={markdownPowered}
              />
              <CodeBlock
                label="Powered by PulseGuard — HTML"
                code={htmlPowered}
              />
              <CodeBlock
                label="Live Status Badge — Markdown"
                code={markdownStatus}
              />
              <CodeBlock label="Live Status Badge — HTML" code={htmlStatus} />
            </div>

            {/* Style variants reference */}
            <div className="bg-black/30 border border-white/5 rounded-sm p-3 space-y-1.5">
              <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                Customise via URL params
              </p>
              <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-muted-foreground">
                <span>
                  <span className="text-primary">theme</span>=dark|light
                </span>
                <span>
                  <span className="text-primary">style</span>=flat|outline
                </span>
                <span>
                  <span className="text-primary">size</span>=sm|lg
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
