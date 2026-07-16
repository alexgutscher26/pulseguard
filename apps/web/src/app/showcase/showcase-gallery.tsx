"use client";

import { useState } from "react";
import { ExternalLink, ArrowUpRight, Moon, Globe, Sparkles, Shield, Activity } from "lucide-react";
import Link from "next/link";

type ShowcaseEntry = {
  name: string;
  slug: string;
  tagline: string;
  theme: string;
  themeColors: { primary: string; bg: string; text: string };
  preview: {
    status: "operational" | "degraded" | "outage";
    uptime: string;
    monitors: number;
  };
};

const showcaseEntries: ShowcaseEntry[] = [
  {
    name: "CyberPulse API",
    slug: "cyberpulse-api",
    tagline: "High-frequency trading infrastructure",
    theme: "Cyberpunk",
    themeColors: { primary: "#22c55e", bg: "#050505", text: "#e2e8f0" },
    preview: { status: "operational", uptime: "99.97%", monitors: 12 },
  },
  {
    name: "NeonStack Cloud",
    slug: "neonstack-cloud",
    tagline: "Edge computing platform",
    theme: "Midnight",
    themeColors: { primary: "#38bdf8", bg: "#0f172a", text: "#f8fafc" },
    preview: { status: "operational", uptime: "99.99%", monitors: 8 },
  },
  {
    name: "Void Games",
    slug: "void-games",
    tagline: "Multiplayer game server status",
    theme: "Dracula",
    themeColors: { primary: "#ff79c6", bg: "#282a36", text: "#f8f8f2" },
    preview: { status: "degraded", uptime: "98.50%", monitors: 15 },
  },
  {
    name: "Monochrome SaaS",
    slug: "monochrome-saas",
    tagline: "Enterprise analytics dashboard",
    theme: "Monochrome",
    themeColors: { primary: "#000000", bg: "#ffffff", text: "#000000" },
    preview: { status: "operational", uptime: "100%", monitors: 6 },
  },
  {
    name: "Quantum Mesh",
    slug: "quantum-mesh",
    tagline: "Distributed computing network",
    theme: "Custom",
    themeColors: { primary: "#06b6d4", bg: "#09090b", text: "#fafafa" },
    preview: { status: "operational", uptime: "99.95%", monitors: 20 },
  },
  {
    name: "DataStream CDN",
    slug: "datastream-cdn",
    tagline: "Global content delivery",
    theme: "Custom",
    themeColors: { primary: "#f97316", bg: "#0c0a09", text: "#fefce8" },
    preview: { status: "outage", uptime: "96.80%", monitors: 10 },
  },
];

function StatusBadge({ status }: { status: ShowcaseEntry["preview"]["status"] }) {
  const colors = {
    operational: "text-green-500 bg-green-500/10 border-green-500/20",
    degraded: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    outage: "text-red-500 bg-red-500/10 border-red-500/20",
  };
  const labels = { operational: "Operational", degraded: "Degraded", outage: "Outage" };

  return (
    <span
      className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 border ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PreviewMockup({ entry }: { entry: ShowcaseEntry }) {
  const monitors = Array.from({ length: Math.min(entry.preview.monitors, 6) });

  return (
    <div
      className="border rounded-sm overflow-hidden font-mono text-[9px] transition-all duration-300"
      style={{ borderColor: `${entry.themeColors.primary}30` }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between border-b"
        style={{
          borderColor: `${entry.themeColors.primary}20`,
          backgroundColor: `${entry.themeColors.bg}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: entry.themeColors.primary }}
          />
          <span style={{ color: entry.themeColors.text }}>{entry.name}</span>
        </div>
        <StatusBadge status={entry.preview.status} />
      </div>
      {/* Monitors */}
      <div
        className="px-3 py-2 flex flex-col gap-1.5"
        style={{ backgroundColor: entry.themeColors.bg }}
      >
        {monitors.map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <span style={{ color: `${entry.themeColors.text}99` }}>
              {["API Gateway", "Auth Service", "Database", "Cache Layer", "CDN Edge", "WebSocket"][
                i
              ] || `Service ${i + 1}`}
            </span>
            <span className="flex items-center gap-1">
              <div
                className="size-1.5 rounded-full"
                style={{
                  backgroundColor:
                    entry.preview.status === "outage" && i === 0
                      ? "#ef4444"
                      : entry.themeColors.primary,
                }}
              />
              <span style={{ color: entry.themeColors.text }}>{entry.preview.uptime}</span>
            </span>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div
        className="px-3 py-1.5 border-t text-center text-[8px]"
        style={{
          borderColor: `${entry.themeColors.primary}20`,
          backgroundColor: entry.themeColors.bg,
          color: `${entry.themeColors.text}60`,
        }}
      >
        {entry.tagline}
      </div>
    </div>
  );
}

export function ShowcaseGallery() {
  const [filterTheme, setFilterTheme] = useState<string>("all");

  const themes = ["all", "Cyberpunk", "Midnight", "Dracula", "Monochrome", "Custom"];

  const filtered =
    filterTheme === "all"
      ? showcaseEntries
      : showcaseEntries.filter((e) => e.theme === filterTheme);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest w-fit">
          <Sparkles className="size-3" />
          Status Page Showcase
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Beautiful{" "}
          <span className="text-primary underline decoration-primary/30 decoration-2 underline-offset-4">
            Cyberpunk
          </span>{" "}
          Status Pages
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          PulseGuard status pages come alive with cyberpunk aesthetics. Browse featured pages from
          the community, then build your own with one click.
        </p>
      </div>

      {/* Theme Filter */}
      <div className="flex gap-2 flex-wrap">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setFilterTheme(t)}
            className={`text-[10px] font-bold font-mono uppercase tracking-wider px-3 py-1.5 border transition-all ${
              filterTheme === t
                ? "bg-primary text-black border-primary"
                : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((entry) => (
          <div
            key={entry.slug}
            className="group bg-card border border-border hover:border-primary/20 transition-all duration-300 flex flex-col"
          >
            {/* Preview */}
            <div className="p-4 border-b border-border/50">
              <PreviewMockup entry={entry} />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-mono">{entry.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">{entry.tagline}</p>
                </div>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 border"
                  style={{
                    borderColor: `${entry.themeColors.primary}40`,
                    color: entry.themeColors.primary,
                  }}
                >
                  {entry.theme}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center gap-1">
                  <Globe className="size-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {entry.preview.monitors} monitors
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="size-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {entry.preview.uptime}
                  </span>
                </div>
              </div>

              <a
                href={`/status-page/${entry.slug}`}
                className="w-full mt-1 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold font-mono uppercase tracking-wider py-2 flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="size-3" />
                View Status Page
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border border-dashed border-primary/20 bg-primary/[0.02] p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="size-4 text-primary" />
          <span className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">
            Want your status page featured?
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground font-mono max-w-md mx-auto mb-4">
          Upgrade to the Netrunner plan to unlock custom themes, white-labeling, and cyberpunk
          aesthetics. Then share your page with us on Twitter or GitHub.
        </p>
        <Link
          href="/signup?plan=netrunner"
          className="inline-flex items-center gap-1.5 h-9 px-5 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider rounded-sm border border-primary hover:bg-primary/90 transition-all font-mono"
        >
          Get Netrunner <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
