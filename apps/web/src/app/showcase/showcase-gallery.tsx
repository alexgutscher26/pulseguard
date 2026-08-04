"use client";

import { useState } from "react";
import { ExternalLink, ArrowUpRight, Globe, Sparkles, Shield, Activity } from "lucide-react";
import Link from "next/link";
import type { ShowcaseEntry } from "@/actions/showcase";

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
  const monitors = Array.from({ length: Math.min(entry.preview.monitors || 3, 6) });
  const serviceNames = [
    "API Gateway",
    "Auth Service",
    "Database",
    "Cache Layer",
    "CDN Edge",
    "WebSocket",
  ];

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
              {serviceNames[i] || `Service ${i + 1}`}
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

export function ShowcaseGallery({ initialEntries }: { initialEntries: ShowcaseEntry[] }) {
  const [filterTheme, setFilterTheme] = useState<string>("all");

  const themes = ["all", "Cyberpunk", "Midnight", "Dracula", "Monochrome", "Custom"];

  const filtered =
    filterTheme === "all" ? initialEntries : initialEntries.filter((e) => e.theme === filterTheme);

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
      {filtered.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <Sparkles className="size-8 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground font-mono mb-1">
            {filterTheme === "all"
              ? "No status pages in the showcase yet."
              : `No "${filterTheme}" theme pages in the showcase yet.`}
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-mono mb-4">
            Be the first — enable "Feature in Community Showcase" in your status page settings.
          </p>
          <Link
            href="/dashboard/pages"
            className="inline-flex items-center gap-1.5 h-9 px-5 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider rounded-sm border border-primary hover:bg-primary/90 transition-all font-mono"
          >
            Go to Status Pages <ArrowUpRight className="size-3" />
          </Link>
        </div>
      ) : (
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
      )}

      {/* CTA */}
      <div className="border border-dashed border-primary/20 bg-primary/[0.02] p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="size-4 text-primary" />
          <span className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">
            Want your status page featured?
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground font-mono max-w-md mx-auto mb-4">
          Open your status page editor → Settings → enable "Feature in Community Showcase". Your
          page appears here instantly after saving.
        </p>
        <Link
          href="/dashboard/pages"
          className="inline-flex items-center gap-1.5 h-9 px-5 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider rounded-sm border border-primary hover:bg-primary/90 transition-all font-mono"
        >
          Manage Status Pages <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
